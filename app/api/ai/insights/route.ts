import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/claude";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// In-memory cache keyed by userId+month+year — one call per user per day max
const cache = new Map<string, { insight: string; ts: number }>();
const TTL = 1000 * 60 * 60 * 24; // 24 hours
const CACHE_VERSION = 2; // bump to invalidate all cached entries

const SYSTEM_PROMPT = `Eres un asesor financiero personal conciso. Recibirás un resumen de transacciones del mes actual y debes generar exactamente 3 insights útiles, accionables y específicos en español.

Formato de respuesta (sin markdown, sin viñetas, solo 3 frases cortas separadas por |):
<insight 1>|<insight 2>|<insight 3>

Reglas:
- Máximo 20 palabras por insight
- Cuando menciones cifras, usa puntos como separador de miles (ej: 1.395.000, no 1395000)
- Enfócate en patrones, alertas o recomendaciones concretas
- No uses emojis
- No saludes ni introduzcas la respuesta`;

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const now = new Date();
    const month = Math.min(
      12,
      Math.max(
        1,
        parseInt(searchParams.get("month") ?? "") || now.getMonth() + 1,
      ),
    );
    const year = Math.min(
      now.getFullYear() + 1,
      Math.max(
        2000,
        parseInt(searchParams.get("year") ?? "") || now.getFullYear(),
      ),
    );

    const cacheKey = `v${CACHE_VERSION}-${userId}-${year}-${month}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TTL) {
      return NextResponse.json({
        insights: cached.insight.split("|").map((s) => s.trim()),
      });
    }

    // Build summary from DB — minimal data, no raw descriptions sent to Claude
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const [transactions, categories] = await Promise.all([
      db.transactions.findMany({
        where: { userId, date: { gte: start, lte: end } },
        select: { amount: true, category: true },
      }),
      db.category.findMany({
        where: { OR: [{ userId }, { isDefault: true }], isActive: true },
        select: { slug: true, name: true, type: true },
      }),
    ]);

    if (transactions.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    const incomeSlugs = new Set(
      categories.filter((c) => c.type === "income").map((c) => c.slug),
    );
    const slugToName = new Map(categories.map((c) => [c.slug, c.name]));

    // Aggregate by category to minimize tokens sent
    const summary: Record<string, { total: number; count: number }> = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const t of transactions) {
      const amount = parseFloat(t.amount.toString());
      if (incomeSlugs.has(t.category)) {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        const key = slugToName.get(t.category) ?? t.category;
        if (!summary[key]) summary[key] = { total: 0, count: 0 };
        summary[key].total += amount;
        summary[key].count++;
      }
    }

    const summaryText = [
      `Ingresos: ${Math.round(totalIncome)}`,
      `Gastos totales: ${Math.round(totalExpenses)}`,
      `Balance: ${Math.round(totalIncome - totalExpenses)}`,
      ...Object.entries(summary).map(
        ([name, { total, count }]) =>
          `${name}: ${Math.round(total)} (${count} transacciones)`,
      ),
    ].join(", ");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: summaryText }],
    });

    const raw = (
      message.content[0] as { type: string; text: string }
    ).text.trim();
    cache.set(cacheKey, { insight: raw, ts: Date.now() });

    return NextResponse.json({ insights: raw.split("|").map((s) => s.trim()) });
  } catch (e) {
    console.log("[AI_INSIGHTS]", e);
    return NextResponse.json({ insights: [] });
  }
}

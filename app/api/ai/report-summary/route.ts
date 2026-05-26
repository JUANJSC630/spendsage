import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/claude";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Cache keyed by userId+year — one call per user per year
const cache = new Map<string, { summary: string[]; ts: number }>();
const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
const CACHE_VERSION = 2; // bump to invalidate entries with raw slugs

const SYSTEM_PROMPT = `Eres un asesor financiero anual. Recibirás un resumen de finanzas del año y generarás exactamente 4 observaciones clave en español.

Formato de respuesta (sin markdown, sin viñetas, 4 frases separadas por |):
<observación 1>|<observación 2>|<observación 3>|<observación 4>

Reglas:
- Máximo 25 palabras por observación
- Incluye comparaciones entre meses cuando sea relevante
- Identifica el mes de mayor gasto, el de menor gasto, y patrones estacionales
- Usa puntos como separador de miles en cifras (ej: 1.395.000, no 1395000)
- No uses emojis, no saludes`;

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const now = new Date();
    const year = Math.min(
      now.getFullYear() + 1,
      Math.max(
        2000,
        parseInt(searchParams.get("year") ?? "") || now.getFullYear(),
      ),
    );

    const cacheKey = `v${CACHE_VERSION}-${userId}-${year}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TTL) {
      return NextResponse.json({ summary: cached.summary });
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const [transactions, categories] = await Promise.all([
      db.transactions.findMany({
        where: { userId, date: { gte: start, lte: end } },
        select: { amount: true, category: true, date: true },
      }),
      db.category.findMany({
        where: { OR: [{ userId }, { isDefault: true }], isActive: true },
        select: { slug: true, name: true, type: true },
      }),
    ]);

    if (transactions.length < 5) {
      return NextResponse.json({ summary: [] });
    }

    const incomeSlugs = new Set(
      categories.filter((c) => c.type === "income").map((c) => c.slug),
    );
    const slugToName = new Map(categories.map((c) => [c.slug, c.name]));

    // Build month-by-month aggregated summary
    const monthly: Record<
      number,
      { income: number; expenses: number; byCat: Record<string, number> }
    > = {};

    for (const t of transactions) {
      const m = new Date(t.date).getMonth() + 1;
      if (!monthly[m]) monthly[m] = { income: 0, expenses: 0, byCat: {} };
      const amount = parseFloat(t.amount.toString());
      if (incomeSlugs.has(t.category)) {
        monthly[m].income += amount;
      } else {
        monthly[m].expenses += amount;
        monthly[m].byCat[t.category] =
          (monthly[m].byCat[t.category] ?? 0) + amount;
      }
    }

    const MONTH_NAMES = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const lines = Object.entries(monthly)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([m, data]) => {
        const topCat = Object.entries(data.byCat).sort(
          ([, a], [, b]) => b - a,
        )[0];
        const topCatName = topCat
          ? (slugToName.get(topCat[0]) ?? topCat[0])
          : "N/A";
        return `${MONTH_NAMES[Number(m) - 1]}: ing=${Math.round(data.income)} gas=${Math.round(data.expenses)} topCat=${topCatName}`;
      });

    const summaryText = `Año ${year}. ${lines.join(" | ")}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
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
    const summary = raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    cache.set(cacheKey, { summary, ts: Date.now() });
    return NextResponse.json({ summary });
  } catch (e) {
    console.log("[AI_REPORT_SUMMARY]", e);
    return NextResponse.json({ summary: [] });
  }
}

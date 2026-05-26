import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/claude";
import { db } from "@/lib/db";

const today = () => new Date().toISOString().split("T")[0];

const buildPrompt = (
  categoryList: string,
) => `Eres un parser de transacciones financieras. El usuario escribe en lenguaje natural (español) y tú extraes los datos.

Responde ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones:
{
  "description": "<nombre corto, 1-3 palabras en español>",
  "amount": "<número entero sin símbolos ni puntos de miles>",
  "category": "<slug exacto de una de las categorías de abajo>",
  "date": "<YYYY-MM-DD>"
}

Categorías disponibles (usa el slug exacto):
${categoryList}

Reglas:
- Si no menciona monto, usa "0"
- Si no menciona fecha, usa la fecha de hoy
- "ayer" = un día antes de hoy, "antier" = dos días antes
- "k" o "mil" después de un número significa ×1000 (ej: "50k" = "50000")
- Elige la categoría más específica que corresponda`;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    if (text.trim().length > 500) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    // Fetch the user's actual categories so Claude picks the right slug
    const categories = await db.category.findMany({
      where: { OR: [{ userId }, { isDefault: true }], isActive: true },
      select: { slug: true, name: true, type: true, description: true },
      orderBy: { type: "asc" },
    });

    const validSlugs = new Set(categories.map((c) => c.slug));

    const categoryList = categories
      .map(
        (c) =>
          `- ${c.slug}: ${c.name}${c.description ? ` (${c.description})` : ""} [${c.type === "income" ? "ingreso" : "gasto"}]`,
      )
      .join("\n");

    const todayStr = today();
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const dayBefore = new Date(Date.now() - 172800000)
      .toISOString()
      .split("T")[0];

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `${buildPrompt(categoryList)}\n\nHoy es ${todayStr}. Ayer fue ${yesterday}. Antier fue ${dayBefore}.\n\nTransacción: ${text.trim()}`,
        },
      ],
    });

    const raw = (
      message.content[0] as { type: string; text: string }
    ).text.trim();
    const jsonText = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    const parsed = JSON.parse(jsonText);

    const fallback = categories.find((c) => c.type === "expense")?.slug ?? "";

    return NextResponse.json({
      description: String(parsed.description ?? ""),
      amount: String(parsed.amount ?? "0").replace(/\D/g, ""),
      category: validSlugs.has(parsed.category) ? parsed.category : fallback,
      date: parsed.date ?? todayStr,
    });
  } catch (e) {
    console.log("[AI_PARSE_TRANSACTION]", e);
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }
}

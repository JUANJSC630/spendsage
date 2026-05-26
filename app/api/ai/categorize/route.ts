import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/claude";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { description } = await req.json();
    if (!description?.trim()) {
      return NextResponse.json({ category: "" });
    }
    if (description.trim().length > 200) {
      return NextResponse.json({ category: "" }, { status: 400 });
    }

    const categories = await db.category.findMany({
      where: { OR: [{ userId }, { isDefault: true }], isActive: true },
      select: { slug: true, name: true, type: true, description: true },
      orderBy: { type: "asc" },
    });

    const validSlugs = new Set(categories.map((c) => c.slug));
    const fallback = categories.find((c) => c.type === "expense")?.slug ?? "";

    const categoryList = categories
      .map(
        (c) =>
          `- ${c.slug}: ${c.name}${c.description ? ` (${c.description})` : ""} [${c.type === "income" ? "ingreso" : "gasto"}]`,
      )
      .join("\n");

    const prompt = `Eres un categorizador de transacciones financieras. Dado el nombre de una transacción, responde ÚNICAMENTE con el slug exacto de la categoría más apropiada, sin explicaciones.

Categorías disponibles (usa el slug exacto):
${categoryList}

Reglas:
- Responde solo con el slug exacto
- Si no estás seguro, elige la categoría de gastos más general`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 30,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nTransacción: ${description.trim()}`,
        },
      ],
    });

    const raw = (
      message.content[0] as { type: string; text: string }
    ).text.trim();

    return NextResponse.json({
      category: validSlugs.has(raw) ? raw : fallback,
    });
  } catch (e) {
    console.log("[AI_CATEGORIZE]", e);
    return NextResponse.json({ category: "" });
  }
}

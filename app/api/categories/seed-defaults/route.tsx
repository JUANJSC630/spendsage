import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SUGGESTED_CATEGORIES = [
  // ── Ingresos ──────────────────────────────────────────────────────────
  {
    name: "Ingreso freelance",
    slug: "ingreso_freelance",
    color: "#10b981",
    icon: "Laptop",
    type: "income",
  },
  {
    name: "Ingresos familiares",
    slug: "ingresos_familiares",
    color: "#34d399",
    icon: "Users",
    type: "income",
  },

  // ── Gastos de trabajo ─────────────────────────────────────────────────
  {
    name: "Herramientas trabajo",
    slug: "herramientas_trabajo",
    color: "#6366f1",
    icon: "Wrench",
    type: "expense",
  },
  {
    name: "Suscripciones",
    slug: "suscripciones",
    color: "#8b5cf6",
    icon: "CreditCard",
    type: "expense",
  },
  {
    name: "Hosting y servidores",
    slug: "hosting_servidores",
    color: "#a78bfa",
    icon: "Server",
    type: "expense",
  },

  // ── Hogar y personas ─────────────────────────────────────────────────
  {
    name: "Hogar compartido",
    slug: "hogar_compartido",
    color: "#f59e0b",
    icon: "Home",
    type: "expense",
  },
  {
    name: "Colaboradores",
    slug: "colaboradores",
    color: "#fbbf24",
    icon: "Users",
    type: "expense",
  },
  {
    name: "Familia",
    slug: "familia",
    color: "#fcd34d",
    icon: "Heart",
    type: "expense",
  },

  // ── Vida diaria ───────────────────────────────────────────────────────
  {
    name: "Mercado y alimentación",
    slug: "mercado_alimentacion",
    color: "#ef4444",
    icon: "ShoppingCart",
    type: "expense",
  },
  {
    name: "Restaurantes",
    slug: "restaurantes",
    color: "#f87171",
    icon: "UtensilsCrossed",
    type: "expense",
  },
  {
    name: "Servicios públicos",
    slug: "servicios_publicos",
    color: "#3b82f6",
    icon: "Zap",
    type: "expense",
  },
  {
    name: "Telecomunicaciones",
    slug: "telecomunicaciones",
    color: "#60a5fa",
    icon: "Phone",
    type: "expense",
  },
  {
    name: "Transporte",
    slug: "transporte",
    color: "#14b8a6",
    icon: "Car",
    type: "expense",
  },

  // ── Finanzas ─────────────────────────────────────────────────────────
  {
    name: "Efectivo retirado",
    slug: "efectivo_retirado",
    color: "#94a3b8",
    icon: "Banknote",
    type: "expense",
  },
  {
    name: "Créditos y cuotas",
    slug: "creditos_cuotas",
    color: "#f43f5e",
    icon: "TrendingDown",
    type: "expense",
  },
  {
    name: "Impuestos y tasas",
    slug: "impuestos_tasas",
    color: "#64748b",
    icon: "Receipt",
    type: "expense",
  },
  {
    name: "Compras online",
    slug: "compras_online",
    color: "#ec4899",
    icon: "Package",
    type: "expense",
  },

  // ── Ahorro ───────────────────────────────────────────────────────────
  {
    name: "Ahorro / Inversión",
    slug: "ahorro_inversion",
    color: "#0ea5e9",
    icon: "PiggyBank",
    type: "expense",
  },
];

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Get slugs the user already has
    const existing = await db.category.findMany({
      where: { userId },
      select: { slug: true },
    });
    const existingSlugs = new Set(existing.map((c) => c.slug));

    // Only create categories that don't already exist for this user
    const toCreate = SUGGESTED_CATEGORIES.filter(
      (c) => !existingSlugs.has(c.slug),
    );

    if (toCreate.length === 0) {
      return NextResponse.json({ created: 0 });
    }

    await db.category.createMany({
      data: toCreate.map((c) => ({
        userId,
        name: c.name,
        slug: c.slug,
        color: c.color,
        icon: c.icon,
        type: c.type,
        isActive: true,
        isDefault: false,
      })),
    });

    return NextResponse.json({ created: toCreate.length });
  } catch (e) {
    console.log("[CATEGORIES_SEED]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

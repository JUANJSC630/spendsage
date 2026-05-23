const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultCategories = [
  // Gastos
  {
    name: "Alimentación",
    slug: "alimentacion",
    type: "expense",
    color: "#8B5CF6",
    icon: "UtensilsCrossed",
    description: "Gastos en comida y bebidas",
  },
  {
    name: "Educación",
    slug: "educacion",
    type: "expense",
    color: "#3B82F6",
    icon: "GraduationCap",
    description: "Gastos en educación y capacitación",
  },
  {
    name: "Entretenimiento",
    slug: "entretenimiento",
    type: "expense",
    color: "#EC4899",
    icon: "Gamepad2",
    description: "Gastos en entretenimiento y diversión",
  },
  {
    name: "Gastos Fijos",
    slug: "gastos_fijos",
    type: "expense",
    color: "#EF4444",
    icon: "Home",
    description: "Gastos fijos mensuales (renta, servicios, etc.)",
  },
  {
    name: "Gastos Variables",
    slug: "gastos_variables",
    type: "expense",
    color: "#F97316",
    icon: "TrendingUp",
    description: "Gastos variables del mes",
  },
  {
    name: "Impuestos",
    slug: "impuestos",
    type: "expense",
    color: "#84CC16",
    icon: "Receipt",
    description: "Pagos de impuestos y tasas",
  },
  {
    name: "Salud",
    slug: "salud",
    type: "expense",
    color: "#10B981",
    icon: "Heart",
    description: "Gastos médicos y de salud",
  },
  {
    name: "Transporte",
    slug: "transporte",
    type: "expense",
    color: "#06B6D4",
    icon: "Car",
    description: "Gastos en transporte y combustible",
  },
  // Ingresos
  {
    name: "Ingresos",
    slug: "ingresos",
    type: "income",
    color: "#10B981",
    icon: "DollarSign",
    description: "Ingresos principales",
  },
];

async function seedDefaultCategories() {
  try {
    console.log("🌱 Iniciando seed de categorías por defecto...");

    for (const category of defaultCategories) {
      // Verificar si ya existe
      const existing = await prisma.category.findFirst({
        where: {
          slug: category.slug,
          isDefault: true,
        },
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            ...category,
            isDefault: true,
            userId: null, // Sin usuario específico
            isActive: true,
          },
        });
        console.log(`✅ Creada categoría por defecto: ${category.name}`);
      } else {
        console.log(`⚠️  Categoría ya existe: ${category.name}`);
      }
    }

    console.log("🎉 Seed completado exitosamente");
  } catch (error) {
    console.error("❌ Error en seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDefaultCategories().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { seedDefaultCategories };

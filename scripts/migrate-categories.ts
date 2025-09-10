import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "Ingresos",
    slug: "income",
    description: "Salarios, freelance, inversiones, bonificaciones",
    color: "#10B981",
    icon: "DollarSign",
    type: "income"
  },
  {
    name: "Gastos Fijos",
    slug: "fixed_expenses",
    description: "Renta, servicios públicos, seguros, suscripciones",
    color: "#EF4444",
    icon: "Home",
    type: "expense"
  },
  {
    name: "Gastos Variables",
    slug: "variable_expenses",
    description: "Comida, transporte, entretenimiento, compras",
    color: "#F59E0B",
    icon: "ShoppingCart",
    type: "expense"
  },
  {
    name: "Alimentación",
    slug: "food",
    description: "Supermercado, restaurantes, comida rápida",
    color: "#8B5CF6",
    icon: "Coffee",
    type: "expense"
  },
  {
    name: "Transporte",
    slug: "transport",
    description: "Gasolina, transporte público, mantenimiento vehículo",
    color: "#06B6D4",
    icon: "Car",
    type: "expense"
  },
  {
    name: "Entretenimiento",
    slug: "entertainment",
    description: "Películas, juegos, salidas, hobbies",
    color: "#EC4899",
    icon: "Gamepad2",
    type: "expense"
  },
  {
    name: "Salud",
    slug: "health",
    description: "Médicos, medicamentos, seguros médicos",
    color: "#10B981",
    icon: "Heart",
    type: "expense"
  },
  {
    name: "Educación",
    slug: "education",
    description: "Cursos, libros, materiales educativos",
    color: "#3B82F6",
    icon: "GraduationCap",
    type: "expense"
  }
];

async function migrateCategories() {
  console.log('🚀 Starting category migration...');

  try {
    // Obtener todos los usuarios únicos de las transacciones
    const users = await prisma.transactions.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    console.log(`📊 Found ${users.length} users with transactions`);

    for (const user of users) {
      console.log(`👤 Migrating categories for user: ${user.userId}`);
      
      // Crear categorías por defecto para cada usuario
      for (const category of defaultCategories) {
        try {
          await prisma.category.create({
            data: {
              ...category,
              userId: user.userId,
              isActive: true,
            }
          });
          console.log(`  ✅ Created category: ${category.name}`);
        } catch (error: any) {
          if (error.code === 'P2002') {
            console.log(`  ⚠️  Category already exists: ${category.name}`);
          } else {
            console.error(`  ❌ Error creating category ${category.name}:`, error);
          }
        }
      }
    }

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración si el script se ejecuta directamente
if (require.main === module) {
  migrateCategories();
}

export { migrateCategories };
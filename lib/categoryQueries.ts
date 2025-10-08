import { db } from "@/lib/db";

/**
 * Configuración estándar para queries de categorías
 * Incluye categorías del usuario + categorías por defecto, evitando duplicados
 */
export const getCategoriesQuery = (userId: string) => ({
  where: {
    OR: [
      {
        userId,
        isActive: true,
      },
      {
        isDefault: true,
        isActive: true,
      }
    ]
  },
  orderBy: [
    {
      isDefault: "desc" as const, // Categorías por defecto primero
    },
    {
      type: "asc" as const,
    },
    {
      name: "asc" as const,
    },
  ],
});

/**
 * Query para obtener todas las categorías (incluyendo inactivas)
 * Usado en páginas de administración de categorías
 */
export const getAllCategoriesQuery = (userId: string) => ({
  where: {
    OR: [
      {
        userId,
      },
      {
        isDefault: true,
      }
    ]
  },
  orderBy: [
    {
      isDefault: "desc" as const,
    },
    {
      isActive: "desc" as const,
    },
    {
      type: "asc" as const,
    },
    {
      name: "asc" as const,
    },
  ],
});

/**
 * Obtiene categorías activas para el usuario (con deduplicación)
 * Esta función maneja automáticamente los duplicados priorizando las por defecto
 */
export async function getActiveCategories(userId: string) {
  const categories = await db.category.findMany(getCategoriesQuery(userId));

  // Deduplicar por slug, priorizando categorías por defecto
  const uniqueCategories = categories.reduce((acc, category) => {
    const existingIndex = acc.findIndex(c => c.slug === category.slug);

    if (existingIndex === -1) {
      // No existe, agregar
      acc.push(category);
    } else {
      // Existe, mantener la por defecto si aplica
      const existing = acc[existingIndex];
      if (category.isDefault && !existing.isDefault) {
        acc[existingIndex] = category;
      }
    }

    return acc;
  }, [] as typeof categories);

  return uniqueCategories;
}

/**
 * Obtiene todas las categorías para administración (con deduplicación)
 */
export async function getAllCategories(userId: string) {
  const categories = await db.category.findMany(getAllCategoriesQuery(userId));

  // Deduplicar por slug, priorizando categorías por defecto
  const uniqueCategories = categories.reduce((acc, category) => {
    const existingIndex = acc.findIndex(c => c.slug === category.slug);

    if (existingIndex === -1) {
      acc.push(category);
    } else {
      const existing = acc[existingIndex];
      if (category.isDefault && !existing.isDefault) {
        acc[existingIndex] = category;
      }
    }

    return acc;
  }, [] as typeof categories);

  return uniqueCategories;
}

/**
 * Selección básica de campos para categorías
 */
export const basicCategorySelect = {
  id: true,
  name: true,
  slug: true,
  color: true,
  type: true,
  isDefault: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;
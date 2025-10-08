// Mapeo de slugs antiguos a slugs por defecto
export const LEGACY_CATEGORY_MAPPING: Record<string, string> = {
  'food': 'alimentacion',
  'entertainment': 'entretenimiento',
  'income': 'ingresos',
  'variable_expenses': 'gastos_variables',
  'fixed_expenses': 'gastos_fijos',
  'transport': 'transporte',
  'health': 'salud',
  'education': 'educacion',
  'taxes': 'impuestos'
};

// Mapeo inverso (de nuevo a viejo) por si necesitamos backwards compatibility
export const REVERSE_CATEGORY_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_CATEGORY_MAPPING).map(([old, new_]) => [new_, old])
);

/**
 * Resuelve un slug de categoría, manejando tanto slugs nuevos como legacy
 */
export function resolveCategorySlug(slug: string): string {
  // Si existe un mapeo legacy, usar el nuevo slug
  return LEGACY_CATEGORY_MAPPING[slug] || slug;
}

/**
 * Encuentra una categoría por slug, considerando mapeos legacy
 */
export function findCategoryBySlug<T extends { slug: string }>(
  categories: T[],
  targetSlug: string
): T | undefined {
  // Primero buscar el slug directo
  let category = categories.find(cat => cat.slug === targetSlug);

  // Si no se encuentra y hay un mapeo legacy, buscar con el nuevo slug
  if (!category && LEGACY_CATEGORY_MAPPING[targetSlug]) {
    const newSlug = LEGACY_CATEGORY_MAPPING[targetSlug];
    category = categories.find(cat => cat.slug === newSlug);
  }

  return category;
}

/**
 * Obtiene información de categoría incluyendo compatibilidad legacy
 */
export function getCategoryInfo<T extends { slug: string; name: string; type: string; color: string }>(
  categories: T[],
  targetSlug: string
): { category: T | null; isLegacy: boolean; resolvedSlug: string } {
  const isLegacy = targetSlug in LEGACY_CATEGORY_MAPPING;
  const resolvedSlug = resolveCategorySlug(targetSlug);
  const category = findCategoryBySlug(categories, targetSlug);

  return {
    category: category || null,
    isLegacy,
    resolvedSlug
  };
}
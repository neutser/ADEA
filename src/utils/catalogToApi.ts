/**
 * Maps catalog (Shop) category/product IDs to API product IDs.
 * Catalog: crafts, gifts, signs, stationery (37 craft products).
 */

import { catalogCategories } from '@/data/catalog';

export const CATALOG_TO_API_CATEGORY: Record<string, string> = {
  crafts: 'crafts',
  gifts: 'gifts',
  signs: 'signs',
  stationery: 'stationery',
};

/** Index-based API product IDs per category */
const CRAFT_CATEGORY_IDS: Record<string, string[]> = {};
catalogCategories.forEach((cat) => {
  CRAFT_CATEGORY_IDS[cat.id] = cat.products.map((p) => p.apiId!).filter(Boolean);
});

/**
 * Resolve catalog product ID (e.g. crafts-0, signs-2) to API product ID.
 */
export function resolveCatalogProductToApi(catalogProductId: string): string | null {
  if (!catalogProductId) return null;
  const parts = catalogProductId.split('-');
  if (parts.length < 2) return null;

  const lastPart = parts[parts.length - 1];
  const index = parseInt(lastPart, 10);
  if (!isNaN(index)) {
    const categoryId = parts.slice(0, -1).join('-');
    const ids = CRAFT_CATEGORY_IDS[categoryId];
    if (ids && ids[index] !== undefined) return ids[index];
  }

  return null;
}

/**
 * Resolve catalog product ID - handles both "categoryId-index" and "categoryId" formats.
 */
export function getApiProductIdFromCatalog(catalogProductId: string, categoryId?: string): string | null {
  const resolved = resolveCatalogProductToApi(catalogProductId);
  if (resolved) return resolved;

  if (categoryId) {
    const ids = CRAFT_CATEGORY_IDS[categoryId];
    if (ids && ids[0]) return ids[0];
  }

  return null;
}

/**
 * Get API category from catalog category for fallback /design route.
 */
export function getApiCategoryFromCatalog(catalogCategoryId: string): string {
  return CATALOG_TO_API_CATEGORY[catalogCategoryId] || 'crafts';
}

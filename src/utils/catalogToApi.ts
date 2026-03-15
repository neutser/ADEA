/**
 * Maps catalog (Shop) category/product IDs to API product IDs.
 * Catalog uses: business-signs, keychains, wedding, home-decor, pet-products, personalized-gifts, clothing-apparel, corporate-gifts
 * API uses: signs, crafts, apparel, wedding, gifts, stickers, stationery
 */

export const CATALOG_TO_API_CATEGORY: Record<string, string> = {
  'business-signs': 'signs',
  'keychains': 'crafts',
  'wedding': 'wedding',
  'home-decor': 'crafts',
  'pet-products': 'crafts',
  'personalized-gifts': 'gifts',
  'clothing-apparel': 'apparel',
  'corporate-gifts': 'gifts',
  'event-seasonal': 'gifts',
};

/**
 * For catalog products, map categoryId-index to API product ID.
 * Many catalog products map to the same API product (e.g. all business-signs -> sign-3d-logo).
 */
export const CATALOG_PRODUCT_TO_API: Record<string, string> = {
  // business-signs-0 through business-signs-N -> sign-3d-logo
  'keychains': 'keychain-custom',
  'wedding': 'wedding-invite',
  'home-decor': 'plaque-award',
  'pet-products': 'keychain-custom',
  'personalized-gifts': 'keychain-custom',
  'clothing-apparel': 'apparel-polo',
  'corporate-gifts': 'keychain-custom',
  'event-seasonal': 'plaque-award',
};

const SIGNS_API_ID = 'sign-3d-logo';

/**
 * Resolve catalog product ID (e.g. business-signs-0, keychains-5) to API product ID.
 */
export function resolveCatalogProductToApi(catalogProductId: string): string | null {
  if (!catalogProductId) return null;
  const parts = catalogProductId.split('-');
  if (parts.length < 2) return null;

  // Handle format: categoryId-index (e.g. business-signs-0, keychains-5, personalized-gifts-3)
  const lastPart = parts[parts.length - 1];
  const index = parseInt(lastPart, 10);
  if (!isNaN(index)) {
    const categoryId = parts.slice(0, -1).join('-');
    if (categoryId === 'business-signs') return SIGNS_API_ID;
    const apiProduct = CATALOG_PRODUCT_TO_API[categoryId];
    if (apiProduct) return apiProduct;
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
    if (categoryId === 'business-signs') return SIGNS_API_ID;
    return CATALOG_PRODUCT_TO_API[categoryId] || null;
  }

  return null;
}

/**
 * Get API category from catalog category for fallback /design route.
 */
export function getApiCategoryFromCatalog(catalogCategoryId: string): string {
  return CATALOG_TO_API_CATEGORY[catalogCategoryId] || 'signs';
}

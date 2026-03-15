/**
 * Product ID aliases — maps legacy product IDs to backend product IDs.
 * Enables unified product source and design migration.
 */

export const PRODUCT_ALIASES = {
  // Signs (Universal) -> sign-3d-logo (backend)
  'logo-sign': 'sign-3d-logo',
  'led-sign': 'sign-3d-logo',
  'door-sign': 'sign-3d-logo',
  'menu-board': 'sign-3d-logo',
  'qr-sign': 'sign-3d-logo',
  // Crafts
  'keychain': 'keychain-custom',
  'coaster': 'keychain-custom',
  'phone-stand': 'keychain-custom',
  'cake-topper': 'keychain-custom',
  'pet-tag': 'keychain-custom',
  'welcome-sign': 'keychain-custom',
  'bookmark': 'keychain-custom',
  'ornament': 'keychain-custom',
  'plaque': 'plaque-award',
  'stamp': 'keychain-custom',
  // Apparel
  'polo': 'apparel-polo',
  'hoodie': 'apparel-hoodie',
  'tee': 'apparel-hoodie',
  'cap': 'apparel-polo',
  'apron': 'apparel-polo',
  'tote': 'apparel-hoodie',
};

/**
 * Resolve product ID — returns canonical backend ID for alias or id.
 */
export function resolveProductId(idOrAlias) {
  if (!idOrAlias) return null;
  return PRODUCT_ALIASES[idOrAlias] ?? idOrAlias;
}

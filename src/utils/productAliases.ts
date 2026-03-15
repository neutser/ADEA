/**
 * Client-side product ID resolution — mirrors server productAliases.js.
 * Resolves legacy product IDs to canonical backend product IDs.
 */

export const PRODUCT_ALIASES: Record<string, string> = {
  'logo-sign': 'sign-3d-logo',
  'led-sign': 'sign-3d-logo',
  'door-sign': 'sign-3d-logo',
  'menu-board': 'sign-3d-logo',
  'qr-sign': 'sign-3d-logo',
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
  'polo': 'apparel-polo',
  'hoodie': 'apparel-hoodie',
  'tee': 'apparel-hoodie',
  'cap': 'apparel-polo',
  'apron': 'apparel-polo',
  'tote': 'apparel-hoodie',
};

export function resolveProductId(idOrAlias: string | null): string | null {
  if (!idOrAlias) return null;
  return PRODUCT_ALIASES[idOrAlias] ?? idOrAlias;
}

/**
 * Product ID aliases — maps legacy product IDs to backend product IDs.
 * Enables unified product source and design migration.
 * Updated for craft product catalog (2D customizable).
 */

export const PRODUCT_ALIASES = {
  // Signs -> craft-sign
  'sign-3d-logo': 'craft-sign',
  'logo-sign': 'craft-sign',
  'led-sign': 'craft-sign',
  'door-sign': 'craft-door',
  'menu-board': 'craft-sign',
  'qr-sign': 'craft-sign',
  'welcome-sign': 'craft-welcome',
  // Crafts
  'keychain': 'craft-keychain',
  'coaster': 'craft-coaster',
  'phone-stand': 'craft-keychain',
  'cake-topper': 'craft-ornament',
  'pet-tag': 'craft-pet-tag',
  'bookmark': 'craft-bookmark',
  'ornament': 'craft-ornament',
  'plaque': 'craft-plaque',
  'stamp': 'craft-stamp',
  // Gifts
  'mug': 'craft-mug',
  'pen': 'craft-pen',
  'box': 'craft-box',
  'journal': 'craft-journal',
  'chopping': 'craft-chopping',
  'tumbler': 'craft-tumbler',
  'champagne': 'craft-champagne',
  'wallet': 'craft-wallet',
  'card-holder': 'craft-card-holder',
  'teacher': 'craft-teacher',
  // Stationery
  'notebook': 'craft-notebook',
  'nameplate': 'craft-nameplate',
  'note-holder': 'craft-note-holder',
  // Signs
  'desk-wedge': 'craft-desk-wedge',
  'wall-plaque': 'craft-wall-plaque',
  // Pet / Wedding
  'pet-memorial': 'craft-pet-memorial',
  'wood-slice': 'craft-wood-slice',
};

/**
 * Resolve product ID — returns canonical backend ID for alias or id.
 */
export function resolveProductId(idOrAlias) {
  if (!idOrAlias) return null;
  return PRODUCT_ALIASES[idOrAlias] ?? idOrAlias;
}

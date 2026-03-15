/**
 * Client-side product ID resolution — mirrors server productAliases.js.
 * Updated for craft product catalog (2D customizable).
 */

export const PRODUCT_ALIASES: Record<string, string> = {
  'logo-sign': 'craft-sign',
  'led-sign': 'craft-sign',
  'door-sign': 'craft-door',
  'menu-board': 'craft-sign',
  'qr-sign': 'craft-sign',
  'welcome-sign': 'craft-welcome',
  'keychain': 'craft-keychain',
  'coaster': 'craft-coaster',
  'phone-stand': 'craft-keychain',
  'cake-topper': 'craft-ornament',
  'pet-tag': 'craft-pet-tag',
  'bookmark': 'craft-bookmark',
  'ornament': 'craft-ornament',
  'plaque': 'craft-plaque',
  'stamp': 'craft-stamp',
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
  'notebook': 'craft-notebook',
  'nameplate': 'craft-nameplate',
  'note-holder': 'craft-note-holder',
  'desk-wedge': 'craft-desk-wedge',
  'wall-plaque': 'craft-wall-plaque',
  'pet-memorial': 'craft-pet-memorial',
  'wood-slice': 'craft-wood-slice',
};

export function resolveProductId(idOrAlias: string | null): string | null {
  if (!idOrAlias) return null;
  return PRODUCT_ALIASES[idOrAlias] ?? idOrAlias;
}

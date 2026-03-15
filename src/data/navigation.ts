/**
 * Main website sections per platform spec
 */
export const mainSections = [
  { path: '/signs', label: 'Signs', desc: 'Custom signs, door signs, welcome signs' },
  { path: '/crafts', label: 'Crafts', desc: 'Keychains, coasters, bookmarks, magnets' },
  { path: '/gifts', label: 'Gifts', desc: 'Pens, mugs, plaques, journals' },
  { path: '/wedding', label: 'Wedding & Event', desc: 'Welcome signs, ornaments, keepsakes' },
  { path: '/stationery', label: 'Stationery', desc: 'Notebooks, stamps, nameplates' },
  { path: '/pets', label: 'Pet Products', desc: 'Pet ID tags' },
] as const;

export const navLinks = [
  { to: '/design', label: '✨ Start Designing', highlight: true },
  { to: '/marketplace/configure?product=craft-keychain', label: 'Crafting Studio' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/shop', label: 'Products' },
  { to: '/crafts', label: 'Crafts' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/solutions', label: 'Business' },
];

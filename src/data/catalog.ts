/**
 * Craft product catalog — 37 products across 4 categories (2D customizable).
 * Research-backed: trending laser engraving, Etsy bestsellers, wedding favors, office gifts.
 */

export type MachineType = 'laser' | 'craft' | 'embroidery' | 'dtf';

export interface CatalogProduct {
  name: string;
  price: string;
  img: string;
  machines: MachineType[];
  hasRealtimeCustomization: boolean;
  /** API product ID for configurator */
  apiId?: string;
}

export interface CatalogCategory {
  id: string;
  title: string;
  desc: string;
  products: CatalogProduct[];
}

const unsplash = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'crafts',
    title: 'Crafts & Accessories',
    desc: 'Keychains, coasters, bookmarks, pet tags, wedding favors. Laser-engraved keepsakes.',
    products: [
      { name: 'Acrylic Name Keychain', price: 'From $12', img: unsplash('1611930022073-b7a4ba5fcccd'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-keychain' },
      { name: 'Cork Monogram Coaster Set', price: 'From $14', img: unsplash('1558618666-fcd25c85cd64'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-coaster' },
      { name: 'Leather Bookmark with Tassel', price: 'From $8', img: unsplash('1512820790803-83ca734da794'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-bookmark' },
      { name: 'Wooden Fridge Magnet', price: 'From $6', img: unsplash('1558618666-fcd25c85cd64'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-magnet' },
      { name: 'Wood Slice Christmas Ornament', price: 'From $11', img: unsplash('1512389142860-9c449e58a943'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-ornament' },
      { name: 'Stainless Steel Pet ID Tag', price: 'From $10', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-pet-tag' },
      { name: 'Pet Memorial Paw Keychain', price: 'From $16', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-pet-memorial' },
      { name: 'Wood Slice Wedding Favor', price: 'From $9', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-wood-slice' },
      { name: 'Engraved Bottle Opener', price: 'From $14', img: unsplash('1602143407151-7111542de6e8'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-bottle-opener' },
      { name: 'Leather Luggage Tag', price: 'From $12', img: unsplash('1544816155-12df9643f363'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-luggage-tag' },
      { name: 'Wooden Spoon Set with Monogram', price: 'From $28', img: unsplash('1584990347492-2e0c2c943518'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-spoon-set' },
    ],
  },
  {
    id: 'gifts',
    title: 'Gifts & Drinkware',
    desc: 'Tumblers, mugs, cutting boards, champagne flutes. Wedding, corporate, and personal gifts.',
    products: [
      { name: 'Metal Engraved Ballpoint Pen', price: 'From $22', img: unsplash('1583485088034-697b5bc54ccd'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-pen' },
      { name: 'Ceramic Photo Mug', price: 'From $18', img: unsplash('1453227588063-bb302b62f50b'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-mug' },
      { name: 'Insulated Stainless Steel Tumbler', price: 'From $32', img: unsplash('1556740714-a8395b3bf30f'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-tumbler' },
      { name: 'Walnut Desk Plaque', price: 'From $42', img: unsplash('1586985289688-ca3cf47d3e6e'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-plaque' },
      { name: 'Oak Keepsake Memory Box', price: 'From $48', img: unsplash('1549465220-1a8b9238cd48'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-box' },
      { name: 'Acacia Wood Cutting Board', price: 'From $45', img: unsplash('1594050215750-f8ec00361099'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-chopping' },
      { name: 'Leather Travel Journal', price: 'From $28', img: unsplash('1517842645537-4d25830b2f5e'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-journal' },
      { name: 'Mr & Mrs Champagne Flutes', price: 'From $38', img: unsplash('1513558161293-cdaf765ed2fd'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-champagne' },
      { name: 'Wood & Acrylic Business Card Holder', price: 'From $35', img: unsplash('1562016556-912b7d2bf6cd'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-card-holder' },
      { name: 'Teacher Note Holder', price: 'From $24', img: unsplash('1503676260728-1c00da094a0b'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-teacher' },
      { name: 'Leather RFID Wallet', price: 'From $38', img: unsplash('1627123424574-724758594e93'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-wallet' },
      { name: 'Engraved Cheese Board', price: 'From $38', img: unsplash('1559847844-5315695dadae'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-cheese-board' },
      { name: 'Photo Frame with Engraved Border', price: 'From $32', img: unsplash('1513519245088-0e12902e35a6'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-photo-frame' },
      { name: 'Custom Poker Chip Set', price: 'From $24', img: unsplash('1611195974226-ef7b4617e5b1'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-poker-chips' },
    ],
  },
  {
    id: 'signs',
    title: 'Signs & Office',
    desc: 'Custom signs, door plates, welcome signs, desk wedges. Business and home.',
    products: [
      { name: 'Acrylic Logo Sign', price: 'From $55', img: unsplash('1510074377623-8cf13fb86c08'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-sign' },
      { name: 'Office Door Name Plate', price: 'From $38', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-door' },
      { name: 'Wedding Welcome Sign', price: 'From $65', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-welcome' },
      { name: 'Walnut Desk Wedge', price: 'From $58', img: unsplash('1497366216548-37526070297c'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-desk-wedge' },
      { name: 'Wall Mount Memorial Plaque', price: 'From $48', img: unsplash('1589829085413-56de8ae18c73'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-wall-plaque' },
    ],
  },
  {
    id: 'stationery',
    title: 'Stationery & Desk',
    desc: 'Notebooks, stamps, name plates, note holders. Professional and personal.',
    products: [
      { name: 'A5 Leather Notebook', price: 'From $18', img: unsplash('1531346878377-a5be20888e57'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-notebook' },
      { name: 'Custom Rubber Stamp', price: 'From $24', img: unsplash('1589998059171-988d887df646'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-stamp' },
      { name: 'Rosewood Desk Name Plate', price: 'From $32', img: unsplash('1586985289688-ca3cf47d3e6e'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-nameplate' },
      { name: 'Desk Note Holder with Card Slot', price: 'From $28', img: unsplash('1497215728101-856f4ea42174'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-note-holder' },
      { name: 'Engraved Leather Passport Holder', price: 'From $34', img: unsplash('1488646953014-85cb44e25828'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-passport-holder' },
      { name: 'Custom Wax Seal Stamp', price: 'From $26', img: unsplash('1589998059171-988d887df646'), machines: ['laser'], hasRealtimeCustomization: true, apiId: 'craft-wax-seal' },
    ],
  },
];

/** 4 main categories for homepage */
export const featuredCategories = [
  { id: 'crafts', path: '/crafts', label: 'Crafts', desc: 'Keychains, coasters, pet tags, wedding favors' },
  { id: 'gifts', path: '/gifts', label: 'Gifts', desc: 'Tumblers, cutting boards, champagne flutes' },
  { id: 'signs', path: '/signs', label: 'Signs', desc: 'Logo signs, door plates, desk wedges' },
  { id: 'stationery', path: '/stationery', label: 'Stationery', desc: 'Notebooks, stamps, name plates' },
] as const;

export const totalProductCount = catalogCategories.reduce((sum, c) => sum + c.products.length, 0);

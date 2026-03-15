/**
 * Full product catalog – 120 products across 8 categories
 * Machine mapping: laser (xTool P2S), craft (Silhouette Curio 2), embroidery, dtf
 * hasRealtimeCustomization: products that support AI configurator (logo, text, image, scene preview)
 */

export type MachineType = 'laser' | 'craft' | 'embroidery' | 'dtf';

export interface CatalogProduct {
  name: string;
  price: string;
  img: string;
  machines: MachineType[];
  hasRealtimeCustomization: boolean;
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
    id: 'business-signs',
    title: 'Business Signs & Branding',
    desc: '3D logos, LED signs, office signage, and corporate branding.',
    products: [
      { name: '3D Acrylic Company Logo Sign', price: 'From $299', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'LED Backlit Logo Sign', price: 'From $449', img: unsplash('1563298723-dcfebaa392e3'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Reception Wall Logo', price: 'From $349', img: unsplash('1497366216548-37526070297c'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic Office Door Sign', price: 'From $49', img: unsplash('1542744173-8e7e53415bb0'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Meeting Room Sign', price: 'From $59', img: unsplash('1497215728101-856f4ea42174'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Directional Arrow Sign', price: 'From $79', img: unsplash('1556740714-a8395b3bf30f'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Restaurant Menu Wall Board', price: 'From $199', img: unsplash('1517248135467-4c7edcad34c4'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Barbershop Logo Sign', price: 'From $249', img: unsplash('1521484342378-0027f6ce72a8'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Salon Reception Sign', price: 'From $199', img: unsplash('1598488035139-bdbb2231ce04'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'QR Code Review Sign', price: 'From $89', img: unsplash('1556742049-2e852e7e0614'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Opening Hours Acrylic Sign', price: 'From $69', img: unsplash('1556742049-2e852e7e0614'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Desk Nameplate', price: 'From $39', img: unsplash('1542744173-8e7e53415bb0'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wall Mounted Office Name Sign', price: 'From $79', img: unsplash('1497366216548-37526070297c'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Conference Room Plaque', price: 'From $89', img: unsplash('1542744173-8e7e53415bb0'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Event Booth Sign', price: 'From $199', img: unsplash('1556740714-a8395b3bf30f'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Retail Store Window Sign', price: 'From $149', img: unsplash('1556740714-a8395b3bf30f'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Engraved Corporate Plaque', price: 'From $129', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic Brand Wall Panel', price: 'From $279', img: unsplash('1563298723-dcfebaa392e3'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'LED Company Name Sign', price: 'From $399', img: unsplash('1550745165-9bc0b252726f'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Brushed Acrylic Corporate Sign', price: 'From $249', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'keychains',
    title: 'Personalized Keychains',
    desc: 'Acrylic, wooden, and custom keychains for gifts and branding.',
    products: [
      { name: 'Acrylic Name Keychain', price: 'From $8', img: unsplash('1590874103328-eac38a683ce7'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wooden Name Keychain', price: 'From $10', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Spotify Code Keychain', price: 'From $12', img: unsplash('1611162617474-5b21e879e113'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Map Location Keychain', price: 'From $14', img: unsplash('1524661135-4239957274da'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Couple Name Keychain', price: 'From $10', img: unsplash('1522673607200-fdd9511687d9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Pet Photo Keychain', price: 'From $12', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'QR Code Contact Keychain', price: 'From $10', img: unsplash('1556742049-2e852e7e0614'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Logo Keychain', price: 'From $15', img: unsplash('1590874103328-eac38a683ce7'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Heart Shape Keychain', price: 'From $8', img: unsplash('1518199266791-5375a0f0f689'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Car Plate Keychain', price: 'From $12', img: unsplash('1558618666-fcd25c85cd64'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Engraved Leather Keychain', price: 'From $14', img: unsplash('1481358509831-2fb0705a61d1'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Photo Frame Keychain', price: 'From $11', img: unsplash('1513519245088-0e12902e35a2'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'House Key Keychain', price: 'From $9', img: unsplash('1558618666-fcd25c85cd64'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Zodiac Sign Keychain', price: 'From $10', img: unsplash('1518199266791-5375a0f0f689'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Minimalist Initial Keychain', price: 'From $8', img: unsplash('1590874103328-eac38a683ce7'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'wedding',
    title: 'Wedding Products',
    desc: 'Welcome signs, seating charts, favors, and wedding decor.',
    products: [
      { name: 'Wedding Welcome Sign', price: 'From $149', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic Seating Chart', price: 'From $199', img: unsplash('1465495976277-4387d4b0b4c6'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Table Number Signs', price: 'From $15/ea', img: unsplash('1520854221256-17451cc331bf'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Guest Name Place Cards', price: 'From $2/ea', img: unsplash('1563503541575-cf60b134d1dd'), machines: ['laser', 'craft'], hasRealtimeCustomization: true },
      { name: 'Wedding Cake Topper', price: 'From $79', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Favor Keychains', price: 'From $6/ea', img: unsplash('1590874103328-eac38a683ce7'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Ring Box', price: 'From $49', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Menu Cards', price: 'From $3/ea', img: unsplash('1563503541575-cf60b134d1dd'), machines: ['laser', 'craft'], hasRealtimeCustomization: true },
      { name: 'Custom Bride & Groom Sign', price: 'From $89', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Photo Frame', price: 'From $59', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Guest Book Sign', price: 'From $69', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic Wedding Invitations', price: 'From $8/ea', img: unsplash('1563503541575-cf60b134d1dd'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Table Name Plaques', price: 'From $12/ea', img: unsplash('1520854221256-17451cc331bf'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Bridesmaid Gift Plaque', price: 'From $39', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wedding Timeline Board', price: 'From $129', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'home-decor',
    title: 'Home Decor',
    desc: 'Family signs, quote plaques, wall art, and personalized decor.',
    products: [
      { name: 'Family Name Wall Sign', price: 'From $89', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Quote Wall Sign', price: 'From $79', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Layered Acrylic Wall Art', price: 'From $149', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'House Number Sign', price: 'From $59', img: unsplash('1513694203232-719a280e022f'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Minimalist House Plaque', price: 'From $69', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Nursery Name Sign', price: 'From $79', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Baby Name Plaque', price: 'From $69', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Motivational Wall Quote', price: 'From $59', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Map Wall Art', price: 'From $129', img: unsplash('1524661135-4239957274da'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic LED Name Sign', price: 'From $199', img: unsplash('1563298723-dcfebaa392e3'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Wooden Wall Clock', price: 'From $89', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Layered Geometric Wall Art', price: 'From $119', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Decorative Monogram Wall Sign', price: 'From $69', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Personalized Door Sign', price: 'From $49', img: unsplash('1480074568708-e7b720bb3f09'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Family Welcome Sign', price: 'From $99', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'pet-products',
    title: 'Pet Products',
    desc: 'Engraved tags, plaques, and memorials for your pets.',
    products: [
      { name: 'Engraved Pet Tag', price: 'From $8', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Pet Name Wall Plaque', price: 'From $49', img: unsplash('1512917774080-9991f1c4c750'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Dog House Sign', price: 'From $39', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Pet Memorial Plaque', price: 'From $59', img: unsplash('1589829085413-56de8ae18c73'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Pet Photo Frame', price: 'From $45', img: unsplash('1513519245088-0e12902e35a2'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Pet Feeding Station Sign', price: 'From $29', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Dog Collar Tag', price: 'From $6', img: unsplash('1587300003388-59208cc962cb'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Pet Name LED Sign', price: 'From $79', img: unsplash('1563298723-dcfebaa392e3'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Cat Door Name Sign', price: 'From $24', img: unsplash('1480074568708-e7b720bb3f09'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Personalized Pet Ornament', price: 'From $15', img: unsplash('1512389142860-9c449e58a043'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'personalized-gifts',
    title: 'Personalized Gifts',
    desc: 'Coasters, plaques, bookmarks, and custom gift items.',
    products: [
      { name: 'Engraved Wooden Coasters', price: 'From $24/set', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Acrylic Photo Plaque', price: 'From $39', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Bookmark', price: 'From $8', img: unsplash('1481358509831-2fb0705a61d1'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Engraved Wallet Card', price: 'From $12', img: unsplash('1627123424574-724758594e93'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Phone Stand', price: 'From $19', img: unsplash('1586023492125-27b2c045efd7'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Personalized Fridge Magnet', price: 'From $6', img: unsplash('1556742049-2e852e7e0614'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Engraved Pen', price: 'From $15', img: unsplash('1589829085413-56de8ae18c73'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Desk Name Stand', price: 'From $29', img: unsplash('1542744173-8e7e53415bb0'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Teacher Appreciation Plaque', price: 'From $49', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Godparent Gift Plaque', price: 'From $59', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Anniversary Gift Plaque', price: 'From $69', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Photo Engraved Wood Panel', price: 'From $89', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Family Calendar Board', price: 'From $79', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Personalized Ornament', price: 'From $12', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Custom Puzzle Gift', price: 'From $35', img: unsplash('1550684376-efcbd6e3f031'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'clothing-apparel',
    title: 'Clothing & Apparel',
    desc: 'Embroidered and DTF printed apparel, uniforms, and accessories.',
    products: [
      { name: 'Embroidered Polo Shirt', price: 'From $32', img: unsplash('1581655353564-df123a1eb820'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Embroidered Hoodie', price: 'From $55', img: unsplash('1556821840-0a63f95609a7'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Embroidered Cap', price: 'From $28', img: unsplash('1588850561407-75d1934a8a3b'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Logo Workwear T-Shirt', price: 'From $24', img: unsplash('1521572163474-6864f9cf17ab'), machines: ['dtf', 'embroidery'], hasRealtimeCustomization: true },
      { name: 'DTF Printed Hoodie', price: 'From $45', img: unsplash('1556821840-0a63f95609a7'), machines: ['dtf'], hasRealtimeCustomization: true },
      { name: 'Custom Gym Shirt', price: 'From $22', img: unsplash('1571019613454-1cb2f99b2d8b'), machines: ['dtf'], hasRealtimeCustomization: true },
      { name: 'Personalized Kids Shirt', price: 'From $18', img: unsplash('1521572163474-6864f9cf17ab'), machines: ['dtf'], hasRealtimeCustomization: true },
      { name: 'Company Uniform Shirt', price: 'From $26', img: unsplash('1581655353564-df123a1eb820'), machines: ['embroidery', 'dtf'], hasRealtimeCustomization: true },
      { name: 'Restaurant Apron', price: 'From $28', img: unsplash('1583337130417-3346a1be7dee'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Barber Apron', price: 'From $32', img: unsplash('1583337130417-3346a1be7dee'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Embroidered Beanie', price: 'From $22', img: unsplash('1556821840-0a63f95609a7'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Custom Tote Bag', price: 'From $24', img: unsplash('1553062407-54746032f1b4'), machines: ['dtf', 'embroidery'], hasRealtimeCustomization: true },
      { name: 'Logo Patch', price: 'From $8', img: unsplash('1481358509831-2fb0705a61d1'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Embroidered Jacket', price: 'From $89', img: unsplash('1556821840-0a63f95609a7'), machines: ['embroidery'], hasRealtimeCustomization: true },
      { name: 'Personalized Baby Onesie', price: 'From $16', img: unsplash('1522771932-496c9291a33f'), machines: ['dtf'], hasRealtimeCustomization: true },
    ],
  },
  {
    id: 'event-seasonal',
    title: 'Event & Seasonal Products',
    desc: 'Holiday ornaments, party signs, and seasonal decor.',
    products: [
      { name: 'Christmas Ornament', price: 'From $10', img: unsplash('1512389142860-9c449e58a043'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Christmas Family Name Sign', price: 'From $69', img: unsplash('1512389142860-9c449e58a043'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Halloween Door Sign', price: 'From $39', img: unsplash('1508385082359-6e1c4b0a2d2a'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Easter Name Plaque', price: 'From $49', img: unsplash('1520854221256-17451cc331bf'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Graduation Plaque', price: 'From $59', img: unsplash('1523050854058-8dfc10c0a7ad'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Birthday Cake Topper', price: 'From $29', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Birthday Party Welcome Sign', price: 'From $49', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Event Photo Frame', price: 'From $45', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'Party Name Banner', price: 'From $39', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser', 'craft'], hasRealtimeCustomization: true },
      { name: 'Holiday Gift Tags', price: 'From $1/ea', img: unsplash('1512389142860-9c449e58a043'), machines: ['laser', 'craft'], hasRealtimeCustomization: true },
      { name: 'Ramadan / Eid Decor Sign', price: 'From $49', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: "Valentine's Day Heart Plaque", price: 'From $39', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: "Mother's Day Gift Plaque", price: 'From $59', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: "Father's Day Gift Sign", price: 'From $59', img: unsplash('1599305445671-ac291c95aaa9'), machines: ['laser'], hasRealtimeCustomization: true },
      { name: 'New Year Party Sign', price: 'From $49', img: unsplash('1519225421980-715cb0215aed'), machines: ['laser'], hasRealtimeCustomization: true },
    ],
  },
];

/** 4 main categories for homepage launch strategy */
export const featuredCategories = [
  { id: 'business-signs', path: '/signs', label: 'Business Signs', desc: '3D logos, LED signs, office signage' },
  { id: 'personalized-gifts', path: '/gifts', label: 'Personalized Gifts', desc: 'Keychains, coasters, custom gifts' },
  { id: 'clothing-apparel', path: '/apparel', label: 'Clothing & Uniforms', desc: 'Embroidery, DTF, uniforms' },
  { id: 'wedding', path: '/wedding', label: 'Wedding & Events', desc: 'Welcome signs, favors, seating' },
] as const;

export const totalProductCount = catalogCategories.reduce((sum, c) => sum + c.products.length, 0);

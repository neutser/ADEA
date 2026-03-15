/**
 * Crafting Products Seed — 2D customizable products only.
 * All products use flat-artwork preview (3D disabled).
 */

const CRAFT_SCHEMA = {
  surfaces: [{ id: 'front', label: 'Design Zone', zones: [{ id: 'main', x: '15%', y: '15%', w: '70%', h: '70%' }] }],
  fields: [
    { id: 'text', type: 'text', label: 'Engraving Text', maxLen: 30, placeholder: 'Your Name' },
    { id: 'subtext', type: 'text', label: 'Subtext', maxLen: 20, placeholder: 'Date or message', required: false },
    { id: 'logo', type: 'image', label: 'Logo / Photo', required: false, accept: '.png,.jpg,.jpeg,.svg', maxSizeMB: 5 },
    { id: 'material', type: 'select', label: 'Material', options: [
      { id: 'wood_oak', label: 'Natural Wood', priceAdd: 0 },
      { id: 'acrylic_black', label: 'Black Acrylic', priceAdd: 3 },
      { id: 'acrylic_clear', label: 'Clear Acrylic', priceAdd: 2 },
      { id: 'metal_brushed', label: 'Brushed Metal', priceAdd: 5 },
    ], default: 'wood_oak' },
    { id: 'shape', type: 'radio', label: 'Shape', options: [
      { id: 'rounded', label: 'Rounded' },
      { id: 'circle', label: 'Circle' },
      { id: 'rectangle', label: 'Rectangle' },
    ], default: 'rounded' },
    { id: 'font', type: 'font-picker', label: 'Font' },
  ],
  preview: { type: 'flat-artwork' },
  production: { minTextMM: 2 },
};

const CRAFT_CATEGORIES = [
  {
    id: 'crafts',
    name: 'Crafts',
    products: [
      { id: 'craft-keychain', slug: 'craft-keychain', name: 'Acrylic Name Keychain', base_price: 12, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600' },
      { id: 'craft-coaster', slug: 'craft-coaster', name: 'Cork Monogram Coaster Set', base_price: 14, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
      { id: 'craft-bookmark', slug: 'craft-bookmark', name: 'Leather Bookmark with Tassel', base_price: 8, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600' },
      { id: 'craft-magnet', slug: 'craft-magnet', name: 'Wooden Fridge Magnet', base_price: 6, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
      { id: 'craft-ornament', slug: 'craft-ornament', name: 'Wood Slice Christmas Ornament', base_price: 11, image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a943?w=600' },
      { id: 'craft-pet-tag', slug: 'craft-pet-tag', name: 'Stainless Steel Pet ID Tag', base_price: 10, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600' },
      { id: 'craft-pet-memorial', slug: 'craft-pet-memorial', name: 'Pet Memorial Paw Keychain', base_price: 16, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600' },
      { id: 'craft-wood-slice', slug: 'craft-wood-slice', name: 'Wood Slice Wedding Favor', base_price: 9, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600' },
      { id: 'craft-bottle-opener', slug: 'craft-bottle-opener', name: 'Engraved Bottle Opener', base_price: 14, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600' },
      { id: 'craft-luggage-tag', slug: 'craft-luggage-tag', name: 'Leather Luggage Tag', base_price: 12, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600' },
      { id: 'craft-spoon-set', slug: 'craft-spoon-set', name: 'Wooden Spoon Set with Monogram', base_price: 28, image: 'https://images.unsplash.com/photo-1584990347492-2e0c2c943518?w=600' },
    ],
  },
  {
    id: 'gifts',
    name: 'Gifts',
    products: [
      { id: 'craft-pen', slug: 'craft-pen', name: 'Metal Engraved Ballpoint Pen', base_price: 22, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600' },
      { id: 'craft-mug', slug: 'craft-mug', name: 'Ceramic Photo Mug', base_price: 18, image: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=600' },
      { id: 'craft-tumbler', slug: 'craft-tumbler', name: 'Insulated Stainless Steel Tumbler', base_price: 32, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600' },
      { id: 'craft-plaque', slug: 'craft-plaque', name: 'Walnut Desk Plaque', base_price: 42, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600' },
      { id: 'craft-box', slug: 'craft-box', name: 'Oak Keepsake Memory Box', base_price: 48, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600' },
      { id: 'craft-chopping', slug: 'craft-chopping', name: 'Acacia Wood Cutting Board', base_price: 45, image: 'https://images.unsplash.com/photo-1594050215750-f8ec00361099?w=600' },
      { id: 'craft-journal', slug: 'craft-journal', name: 'Leather Travel Journal', base_price: 28, image: 'https://images.unsplash.com/photo-1517842645537-4d25830b2f5e?w=600' },
      { id: 'craft-champagne', slug: 'craft-champagne', name: 'Mr & Mrs Champagne Flutes', base_price: 38, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600' },
      { id: 'craft-card-holder', slug: 'craft-card-holder', name: 'Wood & Acrylic Business Card Holder', base_price: 35, image: 'https://images.unsplash.com/photo-1562016556-912b7d2bf6cd?w=600' },
      { id: 'craft-teacher', slug: 'craft-teacher', name: 'Teacher Note Holder', base_price: 24, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600' },
      { id: 'craft-wallet', slug: 'craft-wallet', name: 'Leather RFID Wallet', base_price: 38, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600' },
      { id: 'craft-cheese-board', slug: 'craft-cheese-board', name: 'Engraved Cheese Board', base_price: 38, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600' },
      { id: 'craft-photo-frame', slug: 'craft-photo-frame', name: 'Photo Frame with Engraved Border', base_price: 32, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600' },
      { id: 'craft-poker-chips', slug: 'craft-poker-chips', name: 'Custom Poker Chip Set', base_price: 24, image: 'https://images.unsplash.com/photo-1611195974226-ef7b4617e5b1?w=600' },
    ],
  },
  {
    id: 'signs',
    name: 'Signs',
    products: [
      { id: 'craft-sign', slug: 'craft-sign', name: 'Acrylic Logo Sign', base_price: 55, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=600' },
      { id: 'craft-door', slug: 'craft-door', name: 'Office Door Name Plate', base_price: 38, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600' },
      { id: 'craft-welcome', slug: 'craft-welcome', name: 'Wedding Welcome Sign', base_price: 65, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600' },
      { id: 'craft-desk-wedge', slug: 'craft-desk-wedge', name: 'Walnut Desk Wedge', base_price: 58, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600' },
      { id: 'craft-wall-plaque', slug: 'craft-wall-plaque', name: 'Wall Mount Memorial Plaque', base_price: 48, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600' },
      { id: 'craft-house-number', slug: 'craft-house-number', name: 'Engraved House Number Plaque', base_price: 42, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600' },
      { id: 'craft-table-tent', slug: 'craft-table-tent', name: 'Restaurant Table Tent', base_price: 18, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    products: [
      { id: 'craft-notebook', slug: 'craft-notebook', name: 'A5 Leather Notebook', base_price: 18, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600' },
      { id: 'craft-stamp', slug: 'craft-stamp', name: 'Custom Rubber Stamp', base_price: 24, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600' },
      { id: 'craft-nameplate', slug: 'craft-nameplate', name: 'Rosewood Desk Name Plate', base_price: 32, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600' },
      { id: 'craft-note-holder', slug: 'craft-note-holder', name: 'Desk Note Holder with Card Slot', base_price: 28, image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600' },
      { id: 'craft-passport-holder', slug: 'craft-passport-holder', name: 'Engraved Leather Passport Holder', base_price: 34, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600' },
      { id: 'craft-wax-seal', slug: 'craft-wax-seal', name: 'Custom Wax Seal Stamp', base_price: 26, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600' },
    ],
  },
];

const PRODUCT_DESCRIPTIONS = {
  'craft-keychain': 'Laser-engraved acrylic or wood keychain. Add name, initials, or logo. Perfect for gifts, events, and branding.',
  'craft-coaster': 'Set of 4 cork coasters with monogram or custom design. Eco-friendly, absorbent, ideal for weddings and housewarmings.',
  'craft-bookmark': 'Genuine leather bookmark with tassel. Engrave a name, quote, or date. A thoughtful gift for readers.',
  'craft-magnet': 'Wooden fridge magnet with deep laser etching. Family name, recipe title, or custom design. Won\'t fade.',
  'craft-ornament': 'Wood slice Christmas ornament. Engrave names, year, or holiday message. Rustic holiday decor.',
  'craft-pet-tag': 'Stainless steel pet ID tag. Name, phone number, and optional paw print. Scratch-resistant, hypoallergenic.',
  'craft-pet-memorial': 'Memorial paw keychain for dogs and cats. "Forever Loved" with pet name and years. Keepsake for grieving owners.',
  'craft-wood-slice': 'Natural wood slice wedding favor. Couple names, date, or monogram. 3.5" diameter, hand-sanded. Bulk pricing available.',
  'craft-pen': 'Premium metal ballpoint with laser engraving. Name, quote, or logo. Corporate gifts, graduations, retirements.',
  'craft-mug': '11oz ceramic mug with full-wrap photo or logo. Dishwasher safe. Perfect for offices, events, and personal use.',
  'craft-tumbler': '20oz double-wall insulated tumbler. Keeps drinks cold 24hrs. Engrave name, quote, or design. YETI-style quality.',
  'craft-plaque': 'Solid walnut desk plaque with brass engraving. Name, title, logo. Executive gifts, promotions, law offices.',
  'craft-box': 'Solid oak memory box with hinged lid. Engrave lid with names, dates, or message. Wedding, anniversary, memorial.',
  'craft-chopping': 'Acacia wood cutting board with deep laser etching. Family recipe, monogram, or wedding date. Food-safe mineral oil finish.',
  'craft-journal': 'Leather-bound travel journal. Custom cover engraving. For writers, travelers, and gratitude journaling.',
  'craft-champagne': 'Set of 2 stainless steel champagne flutes. "Mr & Mrs" with names and date. Wedding keepsake, anniversary.',
  'craft-card-holder': 'Walnut base with acrylic front. Laser-engraved logo or name. Holds 25–50 cards. Professional desk accessory.',
  'craft-teacher': 'Apple or pencil-shaped note holder. Wood or acrylic. Teacher appreciation, end-of-year gift.',
  'craft-wallet': 'Genuine leather RFID-blocking wallet. Engrave initials or message. Anniversary, birthday gift for him.',
  'craft-sign': 'Acrylic or wood custom sign. Logo, business name, or quote. Reception, storefront, home office.',
  'craft-door': 'Office door name plate. Name, title, department. Acrylic or wood. Professional, clean look.',
  'craft-welcome': 'Large wedding welcome sign. Couple names, date, or custom message. Acrylic or wood. Stand included.',
  'craft-desk-wedge': 'Solid walnut desk wedge. Name, title, company logo. 8.5"–12.5" sizes. Law firms, medical offices.',
  'craft-wall-plaque': 'Wall-mount memorial or tribute plaque. Engraved name, dates, and message. Pet memorial, dedication.',
  'craft-notebook': 'A5 leather notebook with custom cover. Name, initials, or quote. Lined or dotted. Refillable.',
  'craft-stamp': 'Custom rubber stamp with your name, logo, or text. Self-inking or traditional. For artists, businesses.',
  'craft-nameplate': 'Rosewood desk name plate with card holder. 2"×8" or 2"×10". Gold lettering. Executive office gift.',
  'craft-note-holder': 'Desk note holder with business card slot. Engrave name or logo. Keeps papers and cards organized.',
  'craft-bottle-opener': 'Stainless steel bottle opener with laser engraving. Name, initials, or logo. Bar gifts, weddings, corporate events.',
  'craft-luggage-tag': 'Genuine leather luggage tag with metal plate. Engrave name and contact info. Travel essential, gift for frequent flyers.',
  'craft-spoon-set': 'Set of 3 bamboo or oak spoons with monogram. Kitchen gift, wedding favor, housewarming. Food-safe finish.',
  'craft-cheese-board': 'Bamboo or acacia cheese board with engraved border. Monogram, family name, or wedding date. Serves 6–8.',
  'craft-photo-frame': 'Wood or acrylic photo frame with engraved border. Names, dates, or message. 5×7" or 8×10". Wedding, anniversary.',
  'craft-poker-chips': 'Set of 50 ceramic poker chips with custom design. Logo, initials, or event name. Game night, bachelor party.',
  'craft-house-number': 'Acrylic or metal house number plaque. Address numbers and optional name. Weather-resistant for outdoor use.',
  'craft-table-tent': 'Double-sided table tent for menus, specials, or events. Acrylic or cardstock. Restaurants, catering, conferences.',
  'craft-passport-holder': 'Leather passport holder with interior engraving. Name, initials, or travel quote. RFID-blocking optional.',
  'craft-wax-seal': 'Brass wax seal stamp with custom monogram or logo. Wedding invitations, letters, packaging. Elegant finishing touch.',
};

export function generateCraftProducts() {
  const products = [];
  CRAFT_CATEGORIES.forEach((cat) => {
    cat.products.forEach((p) => {
      products.push({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: cat.id,
        subcategory: cat.id,
        description: PRODUCT_DESCRIPTIONS[p.id] || `Customizable ${p.name.toLowerCase()} with laser engraving. Add your text, logo, or photo.`,
        base_price: p.base_price,
        hero_image: p.image,
        schema: { ...CRAFT_SCHEMA },
        pricing: { type: 'fixed-plus-options' },
        quoteOnly: 0,
        bulk: 1,
        days: 3,
        tags: [cat.id, 'craft', 'engraved', 'customizable'],
      });
    });
  });
  return products;
}

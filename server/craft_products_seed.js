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

/**
 * nameListSchema — schema for products cut one-per-name from a list.
 * `cutKind` names the generator in cutGenerators.js that turns each line into
 * geometry, so the catalogue drives the cutter rather than the UI hardcoding it.
 */
function nameListSchema(cutKind, overrides = {}) {
  const { label = 'Names', placeholder = 'One name per line\nAlisa\nMorgan\nJean-Luc', sizeMin = 6, sizeMax = 18, sizeDefault = 10 } = overrides;
  return {
    cutKind,
    surfaces: [{ id: 'front', label: 'Cut Area', zones: [{ id: 'main', x: '5%', y: '5%', w: '90%', h: '90%' }] }],
    fields: [
      { id: 'names', type: 'textarea', label, rows: 6, maxLen: 2000, placeholder },
      { id: 'font', type: 'font-picker', label: 'Font' },
      { id: 'material', type: 'color-swatch', label: 'Material', options: [
        { id: 'teal', label: 'Teal Acrylic', hex: '#2a7f9e' },
        { id: 'black', label: 'Black Acrylic', hex: '#1a1a1a' },
        { id: 'white', label: 'White Acrylic', hex: '#f2f2f2' },
        { id: 'rose', label: 'Rose Gold', hex: '#b76e79' },
        { id: 'clear', label: 'Clear Acrylic', hex: '#d8e6ea' },
        { id: 'birch', label: 'Birch Ply', hex: '#d9b382' },
      ], default: 'teal' },
      { id: 'fontSize', type: 'slider', label: 'Letter Height', min: sizeMin, max: sizeMax, step: 1, default: sizeDefault, unit: 'mm' },
    ],
    preview: { type: 'flat-artwork' },
    production: { minTextMM: 2, minLineMM: 1 },
  };
}

const CRAFT_CATEGORIES = [
  {
    id: 'party',
    name: 'Party & Event',
    products: [
      { id: 'craft-drink-marker', slug: 'craft-drink-marker', name: 'Name Drink Marker Clips', base_price: 3, schema: nameListSchema('drink-marker'), image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600' },
      { id: 'craft-place-card', slug: 'craft-place-card', name: 'Standing Name Place Cards', base_price: 3, schema: nameListSchema('place-card'), image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600' },
      { id: 'craft-cake-topper', slug: 'craft-cake-topper', name: 'Name Cake Topper', base_price: 15, schema: nameListSchema('cake-topper', { label: 'Names or phrases', sizeMin: 8, sizeMax: 24, sizeDefault: 12 }), image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600' },
      { id: 'craft-favor-tag', slug: 'craft-favor-tag', name: 'Guest Favour Name Tags', base_price: 2, schema: nameListSchema('favour-tag'), image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' },
    ],
  },
  {
    id: 'cut-to-order',
    name: 'Cut to Order',
    products: [
      { id: 'craft-name-keychain', slug: 'craft-name-keychain', name: 'Cut Name Keychains', base_price: 7, schema: nameListSchema('keychain'), image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600' },
      { id: 'craft-name-ornament', slug: 'craft-name-ornament', name: 'Round Name Ornaments', base_price: 9, schema: nameListSchema('ornament'), image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a943?w=600' },
      { id: 'craft-star-ornament', slug: 'craft-star-ornament', name: 'Star Name Ornaments', base_price: 9, schema: nameListSchema('star-ornament'), image: 'https://images.unsplash.com/photo-1543934638-bd2e138430c4?w=600' },
      { id: 'craft-name-bookmark', slug: 'craft-name-bookmark', name: 'Cut Name Bookmarks', base_price: 8, schema: nameListSchema('bookmark'), image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600' },
      { id: 'craft-cut-house-number', slug: 'craft-cut-house-number', name: 'Cut House Numbers', base_price: 26, schema: nameListSchema('house-number', { label: 'House numbers', placeholder: 'One per line\n42\n17A', sizeMin: 8, sizeMax: 30, sizeDefault: 14 }), image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
      { id: 'craft-monogram-coaster', slug: 'craft-monogram-coaster', name: 'Cut Monogram Coasters', base_price: 11, schema: nameListSchema('coaster', { label: 'Initials', placeholder: 'Up to 3 letters per line\nRJT\nAM' }), image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
      { id: 'craft-initial-earrings', slug: 'craft-initial-earrings', name: 'Initial Earrings (Pair)', base_price: 13, schema: nameListSchema('earrings', { label: 'Initials', placeholder: 'One initial per line\nS\nM' }), image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600' },
    ],
  },
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
  'craft-name-keychain': 'Name cut straight through acrylic or birch ply, with a split-ring hole. Paste a list and cut a whole team, class, or party at once.',
  'craft-name-ornament': 'Round hanging ornament with the name cut through the middle and a cord hole at the top. One per guest from a single list.',
  'craft-star-ornament': 'Five-point star ornament with a cut name and hanging hole. Cut a full set from one pasted list.',
  'craft-name-bookmark': 'Long cut bookmark with the name through the body and a tassel hole. Class sets and party favours in one pass.',
  'craft-cut-house-number': 'Large cut house numbers on a mounting rail with pre-drilled fixing holes. Enter one address per line.',
  'craft-monogram-coaster': 'Round coaster with the monogram cut through and a recessed rim. Enter up to three letters per line.',
  'craft-initial-earrings': 'A matched pair of initial earrings cut together, each with a jump-ring hole. One line per pair.',
  'craft-drink-marker': 'Personalized acrylic charms that clip onto any wine or cocktail glass — place settings and drink tags in one. Type or paste a list of names and every clip is laid out on a single cut-ready sheet.',
  'craft-place-card': 'Standing laser-cut name place cards. Paste your guest list and the whole table is generated at once. Acrylic or wood.',
  'craft-cake-topper': 'Cut-out name or phrase cake topper on food-safe acrylic. Letters welded into one piece with a support rail and picks.',
  'craft-favour-tag': 'Small engraved name tags for favour boxes, gift bags, and jars. Cut a full guest list in one pass.',
  'craft-favor-tag': 'Small engraved name tags for favour boxes, gift bags, and jars. Cut a full guest list in one pass.',
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
        schema: p.schema ? { ...p.schema } : { ...CRAFT_SCHEMA },
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

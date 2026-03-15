import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProducts } from './products_seed.js';
import { PRODUCT_ALIASES, resolveProductId } from './productAliases.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better performance
db.exec('PRAGMA journal_mode = WAL');

// ── Create tables ─────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    avatar_url TEXT,
    bio TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS designs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    share_token TEXT UNIQUE,
    product_id TEXT NOT NULL,
    config_json TEXT NOT NULL,
    preview_url TEXT,
    name TEXT,
    version INTEGER DEFAULT 1,
    parent_design_id TEXT,
    notes TEXT,
    is_template INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    design_id TEXT,
    status TEXT DEFAULT 'received',
    items_json TEXT NOT NULL,
    total REAL NOT NULL,
    stripe_session_id TEXT,
    customer_email TEXT,
    customer_name TEXT,
    shipping_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    min_level INTEGER DEFAULT 5,
    unit TEXT DEFAULT 'units',
    price REAL DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pricing_rules (
    id TEXT PRIMARY KEY,
    rule_type TEXT NOT NULL,
    key TEXT NOT NULL,
    value REAL NOT NULL,
    label TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    design_json TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    admin_response TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    page TEXT,
    product_id TEXT,
    metadata_json TEXT,
    session_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  /* ═══ MARKETPLACE TABLES ═══════════════════════════════════ */

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    base_price REAL DEFAULT 0,
    hero_image TEXT,
    gallery_json TEXT,
    customization_schema_json TEXT NOT NULL,
    pricing_rules_json TEXT,
    production_notes TEXT,
    is_active INTEGER DEFAULT 1,
    is_quote_only INTEGER DEFAULT 0,
    supports_bulk INTEGER DEFAULT 1,
    estimated_days INTEGER DEFAULT 5,
    sort_order INTEGER DEFAULT 0,
    tags_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    creator_id TEXT,
    storefront_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    config_json TEXT NOT NULL,
    preview_image TEXT,
    category TEXT,
    tags_json TEXT,
    usage_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS storefronts (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    cover_image TEXT,
    logo_image TEXT,
    branding_json TEXT,
    categories_json TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_assets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    file_data TEXT NOT NULL,
    file_type TEXT,
    width INTEGER,
    height INTEGER,
    tags_json TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS product_suites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    cover_image TEXT,
    product_ids_json TEXT NOT NULL,
    theme_config_json TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    product_id TEXT,
    template_id TEXT,
    storefront_id TEXT,
    rating INTEGER NOT NULL,
    title TEXT,
    body TEXT,
    photo_url TEXT,
    is_approved INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bulk_jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    design_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    rows_json TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    total_rows INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS product_aliases (
    alias TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ── Seed default inventory if empty ───────────────────────
const invCount = db.prepare('SELECT COUNT(*) as c FROM inventory').get();
if (invCount.c === 0) {
  const insert = db.prepare('INSERT INTO inventory (id, name, category, stock, min_level, unit, price) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const items = [
    ['inv-1', 'Clear Acrylic 3mm (600×400mm)', 'Acrylic', 42, 10, 'sheets', 8.5],
    ['inv-2', 'Clear Acrylic 5mm (600×400mm)', 'Acrylic', 28, 10, 'sheets', 12],
    ['inv-3', 'Clear Acrylic 8mm (600×400mm)', 'Acrylic', 15, 8, 'sheets', 18.5],
    ['inv-4', 'Matte Black Acrylic 3mm', 'Acrylic', 22, 10, 'sheets', 11],
    ['inv-5', 'White Acrylic 5mm', 'Acrylic', 6, 10, 'sheets', 13],
    ['inv-6', 'Mirror Gold Acrylic 3mm', 'Acrylic', 9, 5, 'sheets', 22],
    ['inv-7', 'Natural Oak Panel 6mm', 'Wood', 18, 8, 'panels', 14],
    ['inv-8', 'Birch Plywood 4mm', 'Wood', 31, 10, 'sheets', 6.5],
    ['inv-9', 'LED Strip Cool White 5m', 'LED', 14, 5, 'rolls', 18],
    ['inv-10', 'LED Strip Warm White 5m', 'LED', 8, 5, 'rolls', 18],
    ['inv-11', 'LED Driver 12V 2A', 'LED', 11, 5, 'units', 9.5],
    ['inv-12', 'Standoff Hardware Kit', 'Hardware', 3, 10, 'kits', 6],
    ['inv-13', 'Wall Mounting Bracket Set', 'Hardware', 25, 10, 'sets', 4.5],
    ['inv-14', 'Blank Polo Shirts (mixed)', 'Apparel', 50, 20, 'pcs', 8],
    ['inv-15', 'Blank Hoodies (mixed)', 'Apparel', 30, 15, 'pcs', 14],
    ['inv-16', 'DTF Transfer Sheets A3', 'Apparel', 40, 20, 'sheets', 2.5],
    ['inv-17', 'Embroidery Thread Set', 'Apparel', 12, 5, 'sets', 15],
  ];
  db.exec('BEGIN TRANSACTION');
  try {
    for (const i of items) insert.run(...i);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error(err);
  }
}

// ── Seed marketplace products if empty ────────────────────
const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (prodCount.c === 0) {
  const ins = db.prepare('INSERT INTO products (id, slug, name, category, subcategory, description, base_price, hero_image, customization_schema_json, pricing_rules_json, is_quote_only, supports_bulk, estimated_days, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');

  const products = [
    // ── SIGNS ──────────────────────────────────────────
    {
      id: 'sign-3d-logo', slug: '3d-logo-sign', name: '3D Company Logo Sign', category: 'signs', subcategory: 'business',
      description: 'Premium layered acrylic logo sign with LED backlighting options. Perfect for office reception and storefronts.',
      base_price: 149, hero_image: '/images/products/sign_3d_logo.png',
      schema: {
        surfaces: [{ id: 'front', label: 'Front Face' }],
        fields: [
          { id: 'logo', type: 'image', label: 'Logo File', required: true, accept: '.svg,.png,.jpg,.jpeg,.webp', maxSizeMB: 10, minDPI: 150 },
          { id: 'material', type: 'select', label: 'Material', options: [
            { id: 'acrylic_clear', label: 'Clear Acrylic', priceAdd: 0 },
            { id: 'acrylic_white', label: 'White Acrylic', priceAdd: 10 },
            { id: 'acrylic_black', label: 'Matte Black Acrylic', priceAdd: 15 },
            { id: 'wood_oak', label: 'Natural Oak', priceAdd: 25 },
            { id: 'metal_brushed', label: 'Brushed Aluminum', priceAdd: 40 },
          ]},
          { id: 'width', type: 'slider', label: 'Width (cm)', min: 30, max: 250, step: 5, default: 60, unit: 'cm' },
          { id: 'thickness', type: 'radio', label: 'Thickness', options: [
            { id: '3mm', label: '3mm Standard', multiplier: 0.9 },
            { id: '5mm', label: '5mm Premium', multiplier: 1.0 },
            { id: '8mm', label: '8mm Heavy', multiplier: 1.25 },
          ], default: '5mm' },
          { id: 'led', type: 'radio', label: 'LED Illumination', options: [
            { id: 'none', label: 'No LED', multiplier: 1.0 },
            { id: 'warm', label: 'Warm White', multiplier: 1.4 },
            { id: 'cool', label: 'Cool Blue', multiplier: 1.4 },
            { id: 'purple', label: 'Neon Purple', multiplier: 1.5 },
          ], default: 'none' },
          { id: 'mounting', type: 'select', label: 'Mounting', options: [
            { id: 'standoffs', label: 'Wall Standoffs', priceAdd: 25 },
            { id: 'vhb', label: 'VHB Adhesive Tape', priceAdd: 0 },
            { id: 'hanging', label: 'Hanging Wire', priceAdd: 15 },
            { id: 'none', label: 'No Mount (DIY)', priceAdd: 0 },
          ], default: 'standoffs' },
        ],
        preview: { type: 'scene', scenes: ['office-wall', 'brick-wall', 'storefront', 'dark-interior'] },
        production: { minLineMM: 0.5, minTextMM: 3, maxPanelCM: 120, autoSplit: true },
      },
      pricing: { type: 'area', formula: 'width * (width * 0.5) * materialRate * thicknessMultiplier * ledMultiplier + mountPrice + 100' },
      quoteOnly: 0, bulk: 1, days: 5, tags: ['business', 'logo', 'LED', 'reception', 'premium'],
    },
    // ── KEYCHAINS ──────────────────────────────────────
    {
      id: 'keychain-custom', slug: 'custom-keychain', name: 'Custom Engraved Keychain', category: 'crafts', subcategory: 'keychains',
      description: 'Personalized keychain with laser engraving. Available in wood, acrylic, and metal.',
      base_price: 12, hero_image: '/images/products/keychain_custom.png',
      schema: {
        surfaces: [{ id: 'front', label: 'Front' }, { id: 'back', label: 'Back' }],
        fields: [
          { id: 'text', type: 'text', label: 'Engraving Text', maxLen: 30, placeholder: 'Your Name' },
          { id: 'subtext', type: 'text', label: 'Subtext', maxLen: 20, placeholder: 'Date or message', required: false },
          { id: 'icon', type: 'icon-picker', label: 'Icon', icons: ['none','heart','star','paw','infinity','anchor','music','tree'] },
          { id: 'shape', type: 'radio', label: 'Shape', options: [
            { id: 'rounded', label: 'Rounded Rectangle' },
            { id: 'circle', label: 'Circle' },
            { id: 'heart', label: 'Heart' },
            { id: 'dog-tag', label: 'Dog Tag' },
          ], default: 'rounded' },
          { id: 'material', type: 'select', label: 'Material', options: [
            { id: 'wood', label: 'Natural Wood', priceAdd: 0 },
            { id: 'acrylic_clear', label: 'Clear Acrylic', priceAdd: 3 },
            { id: 'leather', label: 'Genuine Leather', priceAdd: 5 },
            { id: 'metal_alum', label: 'Brushed Aluminum', priceAdd: 8 },
          ]},
          { id: 'hardware', type: 'select', label: 'Hardware', options: [
            { id: 'split-ring', label: 'Split Ring (Silver)', priceAdd: 0 },
            { id: 'lobster', label: 'Lobster Clasp (Gold)', priceAdd: 2 },
            { id: 'carabiner', label: 'Mini Carabiner', priceAdd: 3 },
          ]},
          { id: 'font', type: 'font-picker', label: 'Font' },
          { id: 'photo', type: 'image', label: 'Photo (Optional)', required: false, accept: '.png,.jpg,.jpeg', maxSizeMB: 5 },
        ],
        preview: { type: 'product-overlay', background: 'dotgrid' },
        production: { minTextMM: 2 },
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 3, tags: ['gift', 'keychain', 'engraved', 'personalized'],
    },
    // ── APPAREL ────────────────────────────────────────
    {
      id: 'apparel-hoodie', slug: 'custom-hoodie', name: 'Custom Printed Hoodie', category: 'apparel', subcategory: 'hoodies',
      description: 'Premium pullover hoodie with DTF print or embroidery. Available in 8 colors, sizes S-3XL.',
      base_price: 45, hero_image: '/images/products/apparel_hoodie.png',
      schema: {
        surfaces: [
          { id: 'front', label: 'Front', zones: [{ id: 'chest', x: '35%', y: '30%', w: '30%', h: '20%' }, { id: 'left-chest', x: '55%', y: '25%', w: '12%', h: '12%' }] },
          { id: 'back', label: 'Back', zones: [{ id: 'full-back', x: '25%', y: '15%', w: '50%', h: '55%' }] },
          { id: 'sleeve', label: 'Left Sleeve', zones: [{ id: 'sleeve-upper', x: '30%', y: '20%', w: '40%', h: '30%' }] },
        ],
        fields: [
          { id: 'garment_color', type: 'color-swatch', label: 'Hoodie Color', options: [
            { id: 'black', label: 'Black', hex: '#1a1a1a' },
            { id: 'navy', label: 'Navy', hex: '#1a2744' },
            { id: 'heather', label: 'Heather Grey', hex: '#9ca3af' },
            { id: 'white', label: 'White', hex: '#f5f5f5' },
            { id: 'forest', label: 'Forest Green', hex: '#1a3a2a' },
            { id: 'burgundy', label: 'Burgundy', hex: '#5a1a2a' },
            { id: 'tan', label: 'Sand', hex: '#c2a878' },
            { id: 'royal', label: 'Royal Blue', hex: '#2a4a8a' },
          ], default: 'black' },
          { id: 'size', type: 'select', label: 'Size', options: [
            { id: 'S', label: 'Small' }, { id: 'M', label: 'Medium' }, { id: 'L', label: 'Large' },
            { id: 'XL', label: 'X-Large' }, { id: '2XL', label: '2X-Large' }, { id: '3XL', label: '3X-Large', priceAdd: 5 },
          ], default: 'L' },
          { id: 'decoration', type: 'radio', label: 'Decoration Method', options: [
            { id: 'dtf', label: 'DTF Print', priceAdd: 0 },
            { id: 'embroidery', label: 'Embroidery', priceAdd: 12 },
            { id: 'screen', label: 'Screen Print (25+ qty)', priceAdd: -5 },
          ], default: 'dtf' },
          { id: 'text', type: 'text', label: 'Text', maxLen: 40, placeholder: 'Your brand name' },
          { id: 'logo', type: 'image', label: 'Logo / Artwork', required: false, accept: '.svg,.png,.jpg,.jpeg,.webp', maxSizeMB: 10, minDPI: 200 },
          { id: 'placement', type: 'radio', label: 'Primary Placement', options: [
            { id: 'left-chest', label: 'Left Chest' },
            { id: 'chest', label: 'Center Chest' },
            { id: 'full-back', label: 'Full Back' },
            { id: 'sleeve-upper', label: 'Left Sleeve' },
          ], default: 'left-chest' },
          { id: 'font', type: 'font-picker', label: 'Font' },
        ],
        preview: { type: 'garment-overlay' },
        production: { minDPI: 200 },
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 5, tags: ['apparel', 'hoodie', 'custom', 'embroidery', 'DTF'],
    },
    // ── WEDDING INVITATIONS ───────────────────────────
    {
      id: 'wedding-invite', slug: 'wedding-invitation', name: 'Wedding Invitation Suite', category: 'wedding', subcategory: 'invitations',
      description: 'Elegant wedding invitation with matching RSVP card and envelope. Premium paper stocks with optional foil stamping.',
      base_price: 3.50, hero_image: '/images/products/wedding_invite.png',
      schema: {
        surfaces: [
          { id: 'front', label: 'Invitation Front' },
          { id: 'back', label: 'Invitation Back' },
          { id: 'rsvp', label: 'RSVP Card' },
          { id: 'envelope', label: 'Envelope' },
        ],
        fields: [
          { id: 'couple_names', type: 'text', label: 'Couple Names', maxLen: 60, placeholder: 'Sarah & James' },
          { id: 'date', type: 'text', label: 'Wedding Date', placeholder: 'June 15, 2026' },
          { id: 'venue', type: 'textarea', label: 'Venue & Details', maxLen: 200, rows: 3 },
          { id: 'paper', type: 'select', label: 'Paper Stock', options: [
            { id: 'matte', label: 'Premium Matte 300gsm', priceAdd: 0 },
            { id: 'linen', label: 'Linen Texture 320gsm', priceAdd: 0.50 },
            { id: 'cotton', label: 'Cotton Rag 350gsm', priceAdd: 1.50 },
            { id: 'pearl', label: 'Pearlescent 280gsm', priceAdd: 1.00 },
          ]},
          { id: 'size', type: 'radio', label: 'Card Size', options: [
            { id: '5x7', label: '5×7 inches' },
            { id: 'a5', label: 'A5 (148×210mm)' },
            { id: 'square', label: 'Square 6×6 inches', priceAdd: 0.50 },
          ], default: '5x7' },
          { id: 'envelope', type: 'select', label: 'Envelope', options: [
            { id: 'white', label: 'White Standard', priceAdd: 0 },
            { id: 'kraft', label: 'Kraft Brown', priceAdd: 0.25 },
            { id: 'blush', label: 'Blush Pink', priceAdd: 0.50 },
            { id: 'navy', label: 'Navy Blue', priceAdd: 0.50 },
          ]},
          { id: 'foil', type: 'radio', label: 'Foil Stamping', options: [
            { id: 'none', label: 'No Foil', priceAdd: 0 },
            { id: 'gold', label: 'Gold Foil', priceAdd: 1.50 },
            { id: 'rose-gold', label: 'Rose Gold Foil', priceAdd: 1.75 },
            { id: 'silver', label: 'Silver Foil', priceAdd: 1.50 },
          ], default: 'none' },
          { id: 'font', type: 'font-picker', label: 'Font' },
          { id: 'monogram', type: 'image', label: 'Monogram / Logo', required: false, accept: '.svg,.png', maxSizeMB: 5 },
        ],
        preview: { type: 'multi-surface-card' },
        production: { bleedMM: 3, safeAreaMM: 5 },
      },
      pricing: { type: 'per-unit', note: 'Price is per invitation set. Min order 25.' },
      quoteOnly: 0, bulk: 1, days: 7, tags: ['wedding', 'invitation', 'stationery', 'premium', 'foil'],
    },
    // ── MUG ───────────────────────────────────────────
    {
      id: 'mug-custom', slug: 'custom-mug', name: 'Custom Ceramic Mug', category: 'gifts', subcategory: 'drinkware',
      description: '11oz premium ceramic mug with full-wrap sublimation printing. Dishwasher safe.',
      base_price: 16, hero_image: '/images/products/mug_custom.png',
      schema: {
        surfaces: [{ id: 'wrap', label: 'Wrap Area (Full Wrap)' }],
        fields: [
          { id: 'text', type: 'text', label: 'Text', maxLen: 40, placeholder: "World's Best Dad" },
          { id: 'subtext', type: 'text', label: 'Subtext', maxLen: 30, required: false },
          { id: 'photo', type: 'image', label: 'Photo / Artwork', required: false, accept: '.png,.jpg,.jpeg', maxSizeMB: 10, minDPI: 200 },
          { id: 'inside_color', type: 'color-swatch', label: 'Inside Color', options: [
            { id: 'white', label: 'White', hex: '#ffffff' },
            { id: 'black', label: 'Black', hex: '#1a1a1a', priceAdd: 2 },
            { id: 'red', label: 'Red', hex: '#c0392b', priceAdd: 2 },
            { id: 'blue', label: 'Royal Blue', hex: '#2a4a8a', priceAdd: 2 },
          ], default: 'white' },
          { id: 'handle_color', type: 'color-swatch', label: 'Handle Color', options: [
            { id: 'white', label: 'White', hex: '#ffffff' },
            { id: 'black', label: 'Black', hex: '#1a1a1a', priceAdd: 2 },
            { id: 'gold', label: 'Gold', hex: '#d4a544', priceAdd: 4 },
          ], default: 'white' },
          { id: 'font', type: 'font-picker', label: 'Font' },
        ],
        preview: { type: 'product-3d-mockup' },
        production: { wrapWidthMM: 235, wrapHeightMM: 95, bleedMM: 2, minDPI: 200 },
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 3, tags: ['gift', 'mug', 'drinkware', 'photo', 'sublimation'],
    },
    // ── STICKER ────────────────────────────────────────
    {
      id: 'sticker-custom', slug: 'custom-stickers', name: 'Custom Die-Cut Stickers', category: 'stickers', subcategory: 'die-cut',
      description: 'Premium vinyl stickers with die-cut, kiss-cut, or sheet options. Waterproof and UV resistant.',
      base_price: 0.50, hero_image: '/images/products/sticker_custom.png',
      schema: {
        surfaces: [{ id: 'front', label: 'Sticker Face' }],
        fields: [
          { id: 'artwork', type: 'image', label: 'Sticker Artwork', required: true, accept: '.svg,.png,.jpg,.jpeg', maxSizeMB: 10, minDPI: 300 },
          { id: 'cut_type', type: 'radio', label: 'Cut Type', options: [
            { id: 'die-cut', label: 'Die Cut (contour cut)' },
            { id: 'kiss-cut', label: 'Kiss Cut (on backing)' },
            { id: 'sheet', label: 'Sticker Sheet' },
          ], default: 'die-cut' },
          { id: 'size', type: 'select', label: 'Size', options: [
            { id: '2inch', label: '2 inches', priceAdd: 0 },
            { id: '3inch', label: '3 inches', priceAdd: 0.25 },
            { id: '4inch', label: '4 inches', priceAdd: 0.50 },
            { id: '5inch', label: '5 inches', priceAdd: 1.00 },
          ]},
          { id: 'finish', type: 'radio', label: 'Finish', options: [
            { id: 'glossy', label: 'Glossy' },
            { id: 'matte', label: 'Matte Laminate' },
            { id: 'holographic', label: 'Holographic', priceAdd: 0.50 },
          ], default: 'glossy' },
          { id: 'laminate', type: 'checkbox', label: 'Add UV Laminate (+$0.15/ea)', priceAdd: 0.15 },
        ],
        preview: { type: 'flat-artwork' },
        production: { bleedMM: 2, minDPI: 300 },
      },
      pricing: { type: 'per-unit', tiers: [{ min: 50, discount: 0.10 }, { min: 100, discount: 0.20 }, { min: 500, discount: 0.35 }] },
      quoteOnly: 0, bulk: 1, days: 4, tags: ['sticker', 'vinyl', 'die-cut', 'waterproof', 'label'],
    },
    // ── BUSINESS CARD ─────────────────────────────────
    {
      id: 'business-card', slug: 'custom-business-card', name: 'Premium Business Cards', category: 'stationery', subcategory: 'business-cards',
      description: 'Luxury business cards on thick card stock. Available with foil, emboss, or spot UV.',
      base_price: 0.25, hero_image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Front' }, { id: 'back', label: 'Back' }],
        fields: [
          { id: 'name', type: 'text', label: 'Name', placeholder: 'John Smith' },
          { id: 'title', type: 'text', label: 'Job Title', placeholder: 'Creative Director' },
          { id: 'company', type: 'text', label: 'Company', placeholder: 'Acme Corp' },
          { id: 'phone', type: 'text', label: 'Phone', placeholder: '+1 555 123 4567', required: false },
          { id: 'email', type: 'text', label: 'Email', placeholder: 'john@acme.com', required: false },
          { id: 'website', type: 'text', label: 'Website', placeholder: 'www.acme.com', required: false },
          { id: 'logo', type: 'image', label: 'Logo', required: false, accept: '.svg,.png', maxSizeMB: 5 },
          { id: 'paper', type: 'select', label: 'Paper', options: [
            { id: 'matte', label: '400gsm Matte', priceAdd: 0 },
            { id: 'silk', label: '400gsm Silk Laminate', priceAdd: 0.05 },
            { id: 'cotton', label: '600gsm Cotton', priceAdd: 0.15 },
            { id: 'kraft', label: 'Recycled Kraft', priceAdd: 0.08 },
          ]},
          { id: 'finish', type: 'radio', label: 'Special Finish', options: [
            { id: 'none', label: 'None' },
            { id: 'gold-foil', label: 'Gold Foil', priceAdd: 0.20 },
            { id: 'spot-uv', label: 'Spot UV', priceAdd: 0.12 },
            { id: 'emboss', label: 'Blind Emboss', priceAdd: 0.18 },
          ], default: 'none' },
          { id: 'font', type: 'font-picker', label: 'Font' },
        ],
        preview: { type: 'multi-surface-card' },
        production: { bleedMM: 3, safeAreaMM: 3, sizeMM: [89, 51] },
      },
      pricing: { type: 'per-unit', minQty: 50, tiers: [{ min: 100, discount: 0.10 }, { min: 250, discount: 0.20 }, { min: 500, discount: 0.30 }] },
      quoteOnly: 0, bulk: 1, days: 5, tags: ['business', 'card', 'stationery', 'foil', 'premium'],
    },
    // ── PATCH ─────────────────────────────────────────
    {
      id: 'patch-custom', slug: 'custom-patch', name: 'Custom Embroidered Patch', category: 'apparel', subcategory: 'patches',
      description: 'Custom embroidered or woven patches with merrow border. Iron-on, velcro, or sew-on backing.',
      base_price: 4, hero_image: 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Patch Face' }],
        fields: [
          { id: 'artwork', type: 'image', label: 'Patch Artwork', required: true, accept: '.svg,.png,.jpg', maxSizeMB: 10 },
          { id: 'text', type: 'text', label: 'Text (Optional)', maxLen: 30, required: false },
          { id: 'shape', type: 'radio', label: 'Shape', options: [
            { id: 'circle', label: 'Circle' },
            { id: 'rectangle', label: 'Rectangle' },
            { id: 'shield', label: 'Shield' },
            { id: 'custom', label: 'Custom Shape', priceAdd: 2 },
          ], default: 'circle' },
          { id: 'size', type: 'select', label: 'Size', options: [
            { id: '2inch', label: '2 inch' },
            { id: '3inch', label: '3 inch', priceAdd: 1 },
            { id: '4inch', label: '4 inch', priceAdd: 2 },
          ]},
          { id: 'border', type: 'radio', label: 'Border Style', options: [
            { id: 'merrow', label: 'Merrow (overlock)' },
            { id: 'hot-cut', label: 'Hot Cut (flat edge)' },
            { id: 'laser-cut', label: 'Laser Cut', priceAdd: 1 },
          ], default: 'merrow' },
          { id: 'backing', type: 'select', label: 'Backing', options: [
            { id: 'iron-on', label: 'Iron-On', priceAdd: 0 },
            { id: 'velcro', label: 'Velcro (Hook & Loop)', priceAdd: 1.50 },
            { id: 'sew-on', label: 'Sew-On (plain back)', priceAdd: 0 },
            { id: 'pin', label: 'Safety Pin', priceAdd: 0.75 },
          ]},
          { id: 'thread_colors', type: 'number', label: 'Thread Colors', min: 1, max: 12, default: 4 },
        ],
        preview: { type: 'flat-artwork' },
        production: {},
      },
      pricing: { type: 'per-unit', tiers: [{ min: 25, discount: 0.15 }, { min: 50, discount: 0.25 }, { min: 100, discount: 0.35 }] },
      quoteOnly: 0, bulk: 1, days: 10, tags: ['patch', 'embroidered', 'iron-on', 'velcro', 'custom'],
    },
    // ── PLAQUE ─────────────────────────────────────────
    {
      id: 'plaque-award', slug: 'award-plaque', name: 'Personalized Award Plaque', category: 'gifts', subcategory: 'plaques',
      description: 'Elegant engraved plaque on wood or acrylic with optional photo insert. Perfect for awards and recognition.',
      base_price: 35, hero_image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Front Face' }],
        fields: [
          { id: 'title', type: 'text', label: 'Title / Award Name', maxLen: 50, placeholder: 'Employee of the Year' },
          { id: 'recipient', type: 'text', label: 'Recipient Name', maxLen: 40 },
          { id: 'date', type: 'text', label: 'Date', placeholder: 'March 2026', required: false },
          { id: 'body', type: 'textarea', label: 'Body Text', maxLen: 200, rows: 3, required: false },
          { id: 'photo', type: 'image', label: 'Photo Insert', required: false, accept: '.png,.jpg,.jpeg', maxSizeMB: 5 },
          { id: 'material', type: 'select', label: 'Material', options: [
            { id: 'walnut', label: 'Walnut Wood', priceAdd: 0 },
            { id: 'cherry', label: 'Cherry Wood', priceAdd: 5 },
            { id: 'acrylic_clear', label: 'Crystal Acrylic', priceAdd: 10 },
            { id: 'marble', label: 'Faux Marble', priceAdd: 15 },
          ]},
          { id: 'stand', type: 'radio', label: 'Display', options: [
            { id: 'easel', label: 'Easel Stand', priceAdd: 0 },
            { id: 'wall', label: 'Wall Mount', priceAdd: 0 },
            { id: 'floating', label: 'Floating Stand', priceAdd: 8 },
          ], default: 'easel' },
          { id: 'engraving_fill', type: 'radio', label: 'Engraving Fill', options: [
            { id: 'natural', label: 'Natural (no fill)' },
            { id: 'gold', label: 'Gold Fill', priceAdd: 5 },
            { id: 'silver', label: 'Silver Fill', priceAdd: 5 },
            { id: 'black', label: 'Black Fill', priceAdd: 0 },
          ], default: 'natural' },
          { id: 'font', type: 'font-picker', label: 'Font' },
        ],
        preview: { type: 'product-overlay', background: 'office-desk' },
        production: { minTextMM: 3 },
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 5, tags: ['award', 'plaque', 'engraved', 'recognition', 'gift'],
    },
    // ── POLO SHIRT ─────────────────────────────────────
    {
      id: 'apparel-polo', slug: 'custom-polo', name: 'Custom Embroidered Polo', category: 'apparel', subcategory: 'polos',
      description: 'Classic polo shirt with embroidered logo. Ideal for teams, events, and corporate branding.',
      base_price: 28, hero_image: 'https://images.unsplash.com/photo-1625910513413-5fc28e44362e?w=600',
      schema: {
        surfaces: [
          { id: 'front', label: 'Front', zones: [{ id: 'left-chest', x: '55%', y: '28%', w: '14%', h: '14%' }] },
          { id: 'back', label: 'Back', zones: [{ id: 'upper-back', x: '25%', y: '10%', w: '50%', h: '30%' }] },
          { id: 'sleeve', label: 'Sleeve', zones: [{ id: 'sleeve', x: '30%', y: '20%', w: '40%', h: '20%' }] },
        ],
        fields: [
          { id: 'garment_color', type: 'color-swatch', label: 'Polo Color', options: [
            { id: 'white', label: 'White', hex: '#f5f5f5' },
            { id: 'black', label: 'Black', hex: '#1a1a1a' },
            { id: 'navy', label: 'Navy', hex: '#1a2744' },
            { id: 'royal', label: 'Royal Blue', hex: '#2a4a8a' },
            { id: 'red', label: 'Classic Red', hex: '#8a2a2a' },
            { id: 'forest', label: 'Forest Green', hex: '#1a3a2a' },
          ], default: 'navy' },
          { id: 'size', type: 'select', label: 'Size', options: [
            { id: 'S', label: 'Small' }, { id: 'M', label: 'Medium' }, { id: 'L', label: 'Large' },
            { id: 'XL', label: 'XL' }, { id: '2XL', label: '2XL', priceAdd: 3 },
          ], default: 'L' },
          { id: 'text', type: 'text', label: 'Text', maxLen: 30, placeholder: 'Company Name' },
          { id: 'logo', type: 'image', label: 'Logo', required: false, accept: '.svg,.png,.jpg,.jpeg', maxSizeMB: 10 },
          { id: 'placement', type: 'radio', label: 'Primary Placement', options: [
            { id: 'left-chest', label: 'Left Chest' },
            { id: 'upper-back', label: 'Upper Back' },
            { id: 'sleeve', label: 'Left Sleeve' },
          ], default: 'left-chest' },
          { id: 'font', type: 'font-picker', label: 'Font' },
        ],
        preview: { type: 'garment-overlay' },
        production: {},
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 5, tags: ['apparel', 'polo', 'embroidery', 'corporate', 'team'],
    },
    // ── MOCK PRODUCTS (for testing) ─────────────────────
    {
      id: 'mock-sign-1', slug: 'mock-sign-test', name: 'Mock Sign (Test)', category: 'signs', subcategory: 'business',
      description: 'Minimal mock sign for testing the design flow.',
      base_price: 99, hero_image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Front' }],
        fields: [
          { id: 'text', type: 'text', label: 'Text', maxLen: 30, placeholder: 'Your Text' },
          { id: 'width', type: 'slider', label: 'Width (cm)', min: 20, max: 100, step: 5, default: 40, unit: 'cm' },
        ],
        preview: { type: 'scene' },
        production: {},
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 3, tags: ['mock', 'test', 'signs'],
    },
    {
      id: 'mock-keychain-1', slug: 'mock-keychain-test', name: 'Mock Keychain (Test)', category: 'crafts', subcategory: 'keychains',
      description: 'Minimal mock keychain for testing.',
      base_price: 8, hero_image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Front' }],
        fields: [
          { id: 'text', type: 'text', label: 'Text', maxLen: 20, placeholder: 'Name' },
        ],
        preview: { type: 'product-overlay' },
        production: {},
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 2, tags: ['mock', 'test', 'crafts'],
    },
    {
      id: 'mock-apparel-1', slug: 'mock-apparel-test', name: 'Mock Apparel (Test)', category: 'apparel', subcategory: 'polos',
      description: 'Minimal mock apparel for testing.',
      base_price: 25, hero_image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600',
      schema: {
        surfaces: [{ id: 'front', label: 'Front', zones: [{ id: 'chest', x: '30%', y: '25%', w: '40%', h: '30%' }] }],
        fields: [
          { id: 'text', type: 'text', label: 'Text', maxLen: 20, placeholder: 'Brand' },
          { id: 'logo', type: 'image', label: 'Logo', required: false, accept: '.png,.jpg', maxSizeMB: 5 },
        ],
        preview: { type: 'garment-overlay' },
        production: {},
      },
      pricing: { type: 'fixed-plus-options' },
      quoteOnly: 0, bulk: 1, days: 4, tags: ['mock', 'test', 'apparel'],
    },
  ];

  db.exec('BEGIN TRANSACTION');
  try {
    for (const p of products) {
      ins.run(
        p.id, p.slug, p.name, p.category, p.subcategory || null, p.description || '',
        p.base_price, p.hero_image || '', JSON.stringify(p.schema), JSON.stringify(p.pricing),
        p.quoteOnly, p.bulk, p.days, JSON.stringify(p.tags)
      );
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Product seed error:', err);
  }
}

// ── Mass Catalog Expansion (200+ Products) ────────────────
console.log('Syncing mass catalog (250+ products)...');
const ins = db.prepare('INSERT OR REPLACE INTO products (id, slug, name, category, subcategory, description, base_price, hero_image, customization_schema_json, pricing_rules_json, is_quote_only, supports_bulk, estimated_days, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
const massProducts = generateProducts();
  
  db.exec('BEGIN TRANSACTION');
  try {
    for (const p of massProducts) {
      ins.run(
        p.id, p.slug, p.name, p.category, p.subcategory || null, p.description || '',
        p.base_price, p.hero_image || '', JSON.stringify(p.schema), JSON.stringify(p.pricing),
        p.quoteOnly, p.bulk, p.days, JSON.stringify(p.tags)
      );
    }
    db.exec('COMMIT');
    console.log(`Mass catalog seeded: ${massProducts.length} items.`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Mass seed error:', err);
  }

// ── Seed product suites if empty ──────────────────────────
const suiteCount = db.prepare('SELECT COUNT(*) as c FROM product_suites').get();
if (suiteCount.c === 0) {
  const ins = db.prepare('INSERT INTO product_suites (id, name, description, category, product_ids_json, theme_config_json) VALUES (?,?,?,?,?,?)');
  db.exec('BEGIN TRANSACTION');
  try {
    ins.run('suite-wedding', 'Complete Wedding Suite', 'Invitation, RSVP, menu, seating chart, place cards, welcome sign — all coordinated.', 'wedding',
      JSON.stringify(['wedding-invite', 'sign-3d-logo', 'plaque-award']),
      JSON.stringify({ fonts: ['serif-elegant'], palette: ['#d4a544', '#1a2744', '#f5f5f5'] }));
    ins.run('suite-business', 'Business Branding Pack', 'Logo sign, door signs, desk plaques, uniforms, business cards — one cohesive brand identity.', 'business',
      JSON.stringify(['sign-3d-logo', 'business-card', 'apparel-polo', 'plaque-award']),
      JSON.stringify({ fonts: ['sans-modern'], palette: ['#1a1a1a', '#00f0ff', '#ffffff'] }));
    ins.run('suite-restaurant', 'Restaurant Starter Pack', 'Façade sign, menu board, staff aprons, table signage — ready to open.', 'business',
      JSON.stringify(['sign-3d-logo', 'apparel-polo', 'plaque-award', 'sticker-custom']),
      JSON.stringify({ fonts: ['script-casual'], palette: ['#2a4a2a', '#d4a544', '#f5f5f5'] }));
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Suite seed error:', err);
  }
}

// ── Seed storefronts if empty ─────────────────────────────
const storefrontCount = db.prepare('SELECT COUNT(*) as c FROM storefronts').get();
if (storefrontCount.c === 0) {
  const demoOwnerId = 'demo-creator-001';
  const anyUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  const ownerId = anyUser?.id || demoOwnerId;
  const ins = db.prepare('INSERT INTO storefronts (id, owner_id, slug, name, tagline, description, cover_image, logo_image, branding_json, categories_json) VALUES (?,?,?,?,?,?,?,?,?,?)');
  db.exec('BEGIN TRANSACTION');
  try {
    ins.run('sf-demo-signs', ownerId, 'adea-signs', 'Adea Signs Collection', 'Premium signage templates', 'Curated 3D logos, LED signs, and office décor. Professional designs ready to customize.', '', '', '{}', JSON.stringify(['signs', 'business']));
    ins.run('sf-demo-gifts', ownerId, 'adea-gifts', 'Adea Gift Ideas', 'Personalized gifts for every occasion', 'Keychains, mugs, plaques, and more. Perfect for corporate gifts, weddings, and events.', '', '', '{}', JSON.stringify(['crafts', 'gifts', 'wedding']));
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Storefront seed error:', err);
  }
}

// ── Seed storefront templates if empty ────────────────────
const templateForStorefrontCount = db.prepare('SELECT COUNT(*) as c FROM templates WHERE storefront_id IS NOT NULL').get();
if (templateForStorefrontCount.c === 0) {
  const tplIns = db.prepare('INSERT INTO templates (id, product_id, creator_id, storefront_id, name, description, config_json, preview_image, category, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?)');
  const anyUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  const creatorId = anyUser?.id || 'demo-creator-001';
  db.exec('BEGIN TRANSACTION');
  try {
    tplIns.run('tpl-sign-minimal', 'sign-3d-logo', creatorId, 'sf-demo-signs', 'Minimal Office Logo', 'Clean 3D logo for reception areas', '{}', '', 'signs', '[]');
    tplIns.run('tpl-sign-led', 'sign-3d-logo', creatorId, 'sf-demo-signs', 'LED Backlit Sign', 'Premium LED-illuminated business sign', '{}', '', 'signs', '[]');
    tplIns.run('tpl-keychain-gift', 'keychain-custom', creatorId, 'sf-demo-gifts', 'Corporate Keychain', 'Engraved keychain for team gifts', '{}', '', 'crafts', '[]');
    tplIns.run('tpl-mug-photo', 'mug-sublimation', creatorId, 'sf-demo-gifts', 'Photo Mug', 'Personalized photo mug template', '{}', '', 'gifts', '[]');
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Storefront template seed error:', err);
  }
}

// ── Seed product aliases (legacy → canonical) ─────────────
const aliasCount = db.prepare('SELECT COUNT(*) as c FROM product_aliases').get();
if (aliasCount.c === 0) {
  const ins = db.prepare('INSERT INTO product_aliases (alias, product_id) VALUES (?, ?)');
  db.exec('BEGIN TRANSACTION');
  try {
    for (const [alias, productId] of Object.entries(PRODUCT_ALIASES)) {
      ins.run(alias, productId);
    }
    db.exec('COMMIT');
    console.log(`Product aliases seeded: ${Object.keys(PRODUCT_ALIASES).length} mappings.`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Alias seed error:', err);
  }
}

// ── Migrate designs: legacy product_id → canonical ────────
const legacyIds = Object.keys(PRODUCT_ALIASES);
for (const legacyId of legacyIds) {
  const canonical = resolveProductId(legacyId);
  if (canonical !== legacyId) {
    const r = db.prepare('UPDATE designs SET product_id = ? WHERE product_id = ?').run(canonical, legacyId);
    if (r.changes > 0) console.log(`Migrated ${r.changes} design(s): ${legacyId} → ${canonical}`);
  }
}

export default db;

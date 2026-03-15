import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCraftProducts } from './craft_products_seed.js';
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

// ── Craft products only (3D disabled, 2D customizable) ───
db.exec('DELETE FROM products');
db.exec('DELETE FROM product_suites');
db.exec('DELETE FROM templates');
db.exec('DELETE FROM product_aliases');
const craftIns = db.prepare('INSERT INTO products (id, slug, name, category, subcategory, description, base_price, hero_image, customization_schema_json, pricing_rules_json, is_quote_only, supports_bulk, estimated_days, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
const craftProducts = generateCraftProducts();
db.exec('BEGIN TRANSACTION');
try {
  for (const p of craftProducts) {
    craftIns.run(
      p.id, p.slug, p.name, p.category, p.subcategory || null, p.description || '',
      p.base_price, p.hero_image || '', JSON.stringify(p.schema), JSON.stringify(p.pricing),
      p.quoteOnly, p.bulk, p.days, JSON.stringify(p.tags)
    );
  }
  db.exec('COMMIT');
  console.log(`Craft products seeded: ${craftProducts.length} items.`);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('Craft seed error:', err);
}


// ── Seed product suites if empty ──────────────────────────
const suiteCount = db.prepare('SELECT COUNT(*) as c FROM product_suites').get();
if (suiteCount.c === 0) {
  const ins = db.prepare('INSERT INTO product_suites (id, name, description, category, product_ids_json, theme_config_json) VALUES (?,?,?,?,?,?)');
  db.exec('BEGIN TRANSACTION');
  try {
    ins.run('suite-wedding', 'Complete Wedding Suite', 'Welcome sign, place cards, ornaments, keepsake box — all coordinated.', 'wedding',
      JSON.stringify(['craft-welcome', 'craft-sign', 'craft-plaque', 'craft-ornament']),
      JSON.stringify({ fonts: ['serif-elegant'], palette: ['#d4a544', '#1a2744', '#f5f5f5'] }));
    ins.run('suite-business', 'Business Branding Pack', 'Custom sign, door sign, desk plaque, nameplate — one cohesive brand identity.', 'business',
      JSON.stringify(['craft-sign', 'craft-door', 'craft-plaque', 'craft-nameplate']),
      JSON.stringify({ fonts: ['sans-modern'], palette: ['#1a1a1a', '#00f0ff', '#ffffff'] }));
    ins.run('suite-restaurant', 'Restaurant Starter Pack', 'Façade sign, menu board, chopping board, coasters — ready to open.', 'business',
      JSON.stringify(['craft-sign', 'craft-door', 'craft-chopping', 'craft-coaster']),
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
    ins.run('sf-demo-signs', ownerId, 'adea-signs', 'Adea Signs Collection', 'Premium signage templates', 'Custom signs, door signs, and welcome signs. Professional designs ready to customize.', '', '', '{}', JSON.stringify(['signs', 'business']));
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
    tplIns.run('tpl-sign-minimal', 'craft-sign', creatorId, 'sf-demo-signs', 'Minimal Office Sign', 'Clean custom sign for reception areas', '{}', '', 'signs', '[]');
    tplIns.run('tpl-sign-led', 'craft-door', creatorId, 'sf-demo-signs', 'Door Sign', 'Custom door sign for offices', '{}', '', 'signs', '[]');
    tplIns.run('tpl-keychain-gift', 'craft-keychain', creatorId, 'sf-demo-gifts', 'Corporate Keychain', 'Engraved keychain for team gifts', '{}', '', 'crafts', '[]');
    tplIns.run('tpl-mug-photo', 'craft-mug', creatorId, 'sf-demo-gifts', 'Photo Mug', 'Personalized photo mug template', '{}', '', 'gifts', '[]');
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

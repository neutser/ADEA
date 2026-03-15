import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import archiver from 'archiver';
import db from './db.js';
import { generateProductionFile } from './fileGeneration.js';
import { validateForProduction } from './manufacturingValidation.js';
import { resolveProductId } from './productAliases.js';
import { calculateProductPrice } from './pricingService.js';
import { analyzeScene as aiAnalyzeScene } from './ai/sceneAnalysis.js';
import { designAssistant } from './ai/designAssistant.js';
import { generateDesign } from './ai/generativeDesign.js';
import { machineAssistant } from './ai/machineAssistant.js';
import { runProductSeed } from './runSeed.js';
import { toCurioLayers } from './machineExport/curioExport.js';
import { toLightBurnSVG } from './machineExport/xtoolExport.js';
import { generateMockup } from './mockupGenerator.js';

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? (() => { throw new Error('JWT_SECRET must be set in production'); })() : 'adea-crafts-dev-secret');

/* ── Security Headers (C4) ─────────────────────────────────── */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

/* ── Rate Limiting (C4) ───────────────────────────────────── */
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;
function rateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(key, entry);
  }
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count++;
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX - entry.count));
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  next();
}
app.use(rateLimit);

/* ── AI-specific rate limit (stricter, cost control) ─────────── */
const aiLimitStore = new Map();
const AI_LIMIT_MAX = 20;
const AI_LIMIT_WINDOW_MS = 60 * 1000;
function aiRateLimit(req, res, next) {
  const key = `ai:${req.ip || req.socket.remoteAddress || 'unknown'}`;
  const now = Date.now();
  let entry = aiLimitStore.get(key);
  if (!entry) {
    entry = { count: 0, resetAt: now + AI_LIMIT_WINDOW_MS };
    aiLimitStore.set(key, entry);
  }
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + AI_LIMIT_WINDOW_MS;
  }
  entry.count++;
  if (entry.count > AI_LIMIT_MAX) {
    return res.status(429).json({ error: 'AI rate limit exceeded. Please try again in a minute.', code: 'AI_RATE_LIMIT' });
  }
  next();
}

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      cb(null, true);
    } else {
      cb(null, ['http://localhost:5173', 'http://localhost:4173']);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

/* ── Auth Middleware ─────────────────────────────────────── */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

/* ═══ AUTH ROUTES ═══════════════════════════════════════════ */
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const id = randomUUID();
  const hash = bcrypt.hashSync(password, 10);
  const role = email.includes('admin') ? 'admin' : 'customer';
  db.prepare('INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(id, email, name || '', hash, role);
  const token = jwt.sign({ id, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id, email, name, role } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

/* ═══ DESIGN ROUTES ════════════════════════════════════════ */
app.post('/api/designs', authMiddleware, (req, res) => {
  const { productId, config, name } = req.body;
  const canonicalProductId = resolveProductId(productId) || productId;
  const id = randomUUID();
  const shareToken = randomUUID().slice(0, 8);
  db.prepare('INSERT INTO designs (id, user_id, share_token, product_id, config_json, name) VALUES (?,?,?,?,?,?)')
    .run(id, req.user.id, shareToken, canonicalProductId, JSON.stringify(config), name || 'Untitled');
  res.json({ id, shareToken });
});

app.get('/api/designs', authMiddleware, (req, res) => {
  const designs = db.prepare('SELECT * FROM designs WHERE user_id = ? ORDER BY updated_at DESC').all(req.user.id);
  res.json({ designs: designs.map(d => ({ ...d, config: JSON.parse(d.config_json) })) });
});

app.get('/api/designs/share/:token', (req, res) => {
  const design = db.prepare('SELECT * FROM designs WHERE share_token = ?').get(req.params.token);
  if (!design) return res.status(404).json({ error: 'Design not found' });
  res.json({ design: { ...design, config: JSON.parse(design.config_json) } });
});

app.get('/api/designs/:id', authMiddleware, (req, res) => {
  const design = db.prepare('SELECT * FROM designs WHERE id = ?').get(req.params.id);
  if (!design) return res.status(404).json({ error: 'Design not found' });
  if (design.user_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });
  res.json({ design: { ...design, config: JSON.parse(design.config_json) } });
});

/* ═══ ORDER ROUTES ═════════════════════════════════════════ */
app.post('/api/orders', authMiddleware, (req, res) => {
  const { items, total, shipping, designId } = req.body;
  const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
  db.prepare('INSERT INTO orders (id, user_id, design_id, items_json, total, customer_email, customer_name, shipping_json) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, designId || null, JSON.stringify(items), total, req.user.email, req.user.name, JSON.stringify(shipping || {}));
  res.json({ orderId: id, status: 'received' });
});

/* ═══ STRIPE CHECKOUT (A7) ═════════════════════════════════ */
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.post('/api/checkout/create-session', authMiddleware, async (req, res) => {
  const { items, total, shipping } = req.body;
  if (!items?.length || total == null) return res.status(400).json({ error: 'Items and total required' });

  if (!STRIPE_SECRET) {
    return res.status(503).json({ error: 'Stripe not configured', useFallback: true });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    db.prepare('INSERT INTO orders (id, user_id, items_json, total, customer_email, customer_name, shipping_json, status) VALUES (?,?,?,?,?,?,?,?)')
      .run(orderId, req.user.id, JSON.stringify(items), total, req.user.email, req.user.name, JSON.stringify(shipping || {}), 'pending_payment');

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/checkout/success?order_id=${orderId}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
      client_reference_id: orderId,
      customer_email: req.user.email,
    });

    db.prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?').run(session.id, orderId);
    res.json({ url: session.url, orderId });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message || 'Checkout failed' });
  }
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items_json) })) });
});

app.get('/api/orders/all', authMiddleware, adminOnly, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').all();
  res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items_json) })) });
});

app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.user_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });
  const out = { ...order, items: JSON.parse(order.items_json) };
  if (order.design_id) {
    const design = db.prepare('SELECT * FROM designs WHERE id = ?').get(order.design_id);
    if (design) out.design = { ...design, config: JSON.parse(design.config_json) };
  }
  res.json(out);
});

app.patch('/api/orders/:id/status', authMiddleware, adminOnly, (req, res) => {
  const { status } = req.body;
  const valid = ['received', 'design', 'material', 'cutting', 'engraving', 'assembly', 'qc', 'packaging', 'shipping'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE orders SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, req.params.id);
  res.json({ orderId: req.params.id, status });
});

/* ═══ INVENTORY ROUTES ═════════════════════════════════════ */
app.get('/api/inventory', authMiddleware, (req, res) => {
  const items = db.prepare('SELECT * FROM inventory ORDER BY category, name').all();
  res.json({ items });
});

app.post('/api/inventory', authMiddleware, adminOnly, (req, res) => {
  const { name, category, stock, min_level, unit, price } = req.body;
  const id = `inv-${Date.now().toString(36)}`;
  db.prepare('INSERT INTO inventory (id, name, category, stock, min_level, unit, price) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, name, category || 'Uncategorized', stock || 0, min_level || 5, unit || 'units', price || 0);
  res.json({ id });
});

app.delete('/api/inventory/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM inventory WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.patch('/api/inventory/:id', authMiddleware, adminOnly, (req, res) => {
  const { stock, min_level, price } = req.body;
  const sets = [];
  const vals = [];
  if (stock !== undefined) { sets.push('stock = ?'); vals.push(stock); }
  if (min_level !== undefined) { sets.push('min_level = ?'); vals.push(min_level); }
  if (price !== undefined) { sets.push('price = ?'); vals.push(price); }
  if (sets.length === 0) return res.status(400).json({ error: 'No fields to update' });
  sets.push('updated_at = datetime("now")');
  vals.push(req.params.id);
  db.prepare(`UPDATE inventory SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  res.json({ success: true });
});

/* ═══ PRICING RULES ROUTES ═════════════════════════════════ */
app.get('/api/pricing', (req, res) => {
  const rules = db.prepare('SELECT * FROM pricing_rules ORDER BY rule_type, key').all();
  res.json({ rules });
});

app.put('/api/pricing', authMiddleware, adminOnly, (req, res) => {
  const { rules } = req.body;
  const del = db.prepare('DELETE FROM pricing_rules');
  const ins = db.prepare('INSERT INTO pricing_rules (id, rule_type, key, value, label) VALUES (?,?,?,?,?)');
  db.exec('BEGIN TRANSACTION');
  try {
    del.run();
    for (const r of rules) ins.run(r.id || randomUUID(), r.rule_type, r.key, r.value, r.label || '');
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Database error' });
  }
  res.json({ success: true, count: rules.length });
});

/* ═══ QUOTES ═══════════════════════════════════════════════ */
app.post('/api/quotes', (req, res) => {
  const { design, message, email, name } = req.body;
  const id = `Q-${Date.now().toString(36).toUpperCase()}`;
  db.prepare('INSERT INTO quotes (id, design_json, message) VALUES (?,?,?)')
    .run(id, JSON.stringify({ ...design, email, name }), message || '');
  res.json({ quoteId: id });
});

app.get('/api/quotes', authMiddleware, adminOnly, (req, res) => {
  const quotes = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all();
  res.json({ quotes });
});

app.patch('/api/quotes/:id', authMiddleware, adminOnly, (req, res) => {
  const { status, admin_response } = req.body;
  db.prepare('UPDATE quotes SET status = ?, admin_response = ? WHERE id = ?')
    .run(status, admin_response || '', req.params.id);
  res.json({ success: true, status, admin_response });
});

/* ═══ ANALYTICS ════════════════════════════════════════════ */
app.post('/api/analytics', (req, res) => {
  const { event, page, productId, metadata, sessionId } = req.body;
  db.prepare('INSERT INTO analytics_events (event, page, product_id, metadata_json, session_id) VALUES (?,?,?,?,?)')
    .run(event, page || '', productId || '', JSON.stringify(metadata || {}), sessionId || '');
  res.json({ ok: true });
});

app.get('/api/analytics/summary', authMiddleware, adminOnly, (req, res) => {
  const totalEvents = db.prepare('SELECT COUNT(*) as c FROM analytics_events').get().c;
  const pageViews = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'page_view'").get().c;
  const configStarts = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'configurator_start'").get().c;
  const cartAdds = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'add_to_cart'").get().c;
  const topProducts = db.prepare("SELECT product_id, COUNT(*) as c FROM analytics_events WHERE product_id != '' GROUP BY product_id ORDER BY c DESC LIMIT 10").all();
  const recentEvents = db.prepare('SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 50').all();

  const last7 = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'page_view' AND created_at >= datetime('now', '-7 days')").get().c;
  const prev7 = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'page_view' AND created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')").get().c;
  const pageViewsChange = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : null;

  const last7Config = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'configurator_start' AND created_at >= datetime('now', '-7 days')").get().c;
  const prev7Config = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'configurator_start' AND created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')").get().c;
  const configStartsChange = prev7Config > 0 ? Math.round(((last7Config - prev7Config) / prev7Config) * 100) : null;

  const last7Cart = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'add_to_cart' AND created_at >= datetime('now', '-7 days')").get().c;
  const prev7Cart = db.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event = 'add_to_cart' AND created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')").get().c;
  const cartAddsChange = prev7Cart > 0 ? Math.round(((last7Cart - prev7Cart) / prev7Cart) * 100) : null;

  res.json({
    totalEvents, pageViews, configStarts, cartAdds, topProducts, recentEvents,
    pageViewsChange, configStartsChange, cartAddsChange,
  });
});

/* ═══ MARKETPLACE — PRODUCTS ═══════════════════════════════ */
app.get('/api/products', (req, res) => {
  const { category, subcategory, search, tag } = req.query;
  let sql = 'SELECT * FROM products WHERE is_active = 1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (subcategory) { sql += ' AND subcategory = ?'; params.push(subcategory); }
  if (search) { sql += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (tag) { sql += " AND tags_json LIKE ?"; params.push(`%"${tag}"%`); }
  sql += ' ORDER BY sort_order, name';
  const rows = db.prepare(sql).all(...params);
  const products = rows.map(r => {
    let schema, pricing, gallery, tags;
    try {
      schema = typeof r.customization_schema_json === 'string' ? JSON.parse(r.customization_schema_json) : r.customization_schema_json;
      if (typeof schema === 'string') schema = JSON.parse(schema);
    } catch { schema = { surfaces: [], fields: [], preview: { type: 'product-overlay' } }; }
    try {
      pricing = r.pricing_rules_json ? JSON.parse(r.pricing_rules_json) : null;
    } catch { pricing = null; }
    try {
      gallery = r.gallery_json ? JSON.parse(r.gallery_json) : [];
    } catch { gallery = []; }
    try {
      tags = r.tags_json ? JSON.parse(r.tags_json) : [];
    } catch { tags = []; }
    return { ...r, customization_schema: schema, pricing_rules: pricing, gallery, tags };
  });
  res.json({ products });
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const p = req.params.idOrSlug;
  const resolvedId = resolveProductId(p) || p;
  const row = db.prepare('SELECT * FROM products WHERE (id = ? OR slug = ?) AND is_active = 1').get(resolvedId, p);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json({
    product: {
      ...row,
      customization_schema: JSON.parse(row.customization_schema_json),
      pricing_rules: row.pricing_rules_json ? JSON.parse(row.pricing_rules_json) : null,
      gallery: row.gallery_json ? JSON.parse(row.gallery_json) : [],
      tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    },
  });
});

app.get('/api/products/categories/list', (_req, res) => {
  const cats = db.prepare("SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category").all();
  res.json({ categories: cats.map(c => c.category) });
});

/* ═══ MARKETPLACE — PRICING ════════════════════════════════ */
app.post('/api/pricing/calculate', (req, res) => {
  const { productId, config, options, quantity } = req.body;
  const canonicalProductId = resolveProductId(productId) || productId;
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(canonicalProductId);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  const opts = config || options || {};
  const result = calculateProductPrice(row, opts, quantity);
  res.json(result);
});

/* ═══ MARKETPLACE — TEMPLATES ══════════════════════════════ */
app.get('/api/templates', (req, res) => {
  const { productId, category, featured } = req.query;
  let sql = 'SELECT * FROM templates WHERE is_active = 1';
  const params = [];
  if (productId) { sql += ' AND product_id = ?'; params.push(productId); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (featured === '1') { sql += ' AND is_featured = 1'; }
  sql += ' ORDER BY usage_count DESC LIMIT 100';
  const rows = db.prepare(sql).all(...params);
  res.json({ templates: rows.map(r => ({ ...r, config: JSON.parse(r.config_json), tags: r.tags_json ? JSON.parse(r.tags_json) : [] })) });
});

/* ═══ MOCKUP GENERATOR ═══════════════════════════════════ */
app.post('/api/mockup/generate', async (req, res) => {
  const { designId, productId, templateId, format = 'png', width = 600, designImage, productImageUrl } = req.body;
  const canonicalProductId = resolveProductId(productId) || productId;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(canonicalProductId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const heroUrl = productImageUrl || product.hero_image;
  if (!heroUrl) return res.status(400).json({ error: 'Product has no hero image' });
  try {
    const result = await generateMockup({
      designImage: designImage || null,
      productImageUrl: heroUrl,
      format,
      width: Number(width) || 600,
    });
    if (result.buffer) {
      res.setHeader('Content-Type', `image/${format}`);
      res.setHeader('Content-Disposition', `inline; filename="mockup.${format}"`);
      res.send(result.buffer);
    } else {
      res.json({ url: result.url });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Mockup generation failed' });
  }
});

app.post('/api/templates', authMiddleware, (req, res) => {
  const { productId, name, description, config, category, previewImage, tags, storefrontId } = req.body;
  const id = randomUUID();
  db.prepare('INSERT INTO templates (id, product_id, creator_id, storefront_id, name, description, config_json, preview_image, category, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, productId, req.user.id, storefrontId || null, name, description || '', JSON.stringify(config), previewImage || '', category || '', JSON.stringify(tags || []));
  res.json({ id });
});

app.post('/api/templates/:id/use', (req, res) => {
  db.prepare('UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?').run(req.params.id);
  const row = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Template not found' });
  res.json({ template: { ...row, config: JSON.parse(row.config_json) } });
});

/* ═══ MARKETPLACE — STOREFRONTS ════════════════════════════ */
app.get('/api/storefronts', (_req, res) => {
  const rows = db.prepare('SELECT * FROM storefronts WHERE is_active = 1 ORDER BY name').all();
  res.json({ storefronts: rows.map(r => ({ ...r, branding: r.branding_json ? JSON.parse(r.branding_json) : {}, categories: r.categories_json ? JSON.parse(r.categories_json) : [] })) });
});

app.get('/api/storefronts/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM storefronts WHERE slug = ? AND is_active = 1').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Storefront not found' });
  const templates = db.prepare('SELECT * FROM templates WHERE storefront_id = ? AND is_active = 1 ORDER BY usage_count DESC').all(row.id);
  res.json({
    storefront: { ...row, branding: row.branding_json ? JSON.parse(row.branding_json) : {}, categories: row.categories_json ? JSON.parse(row.categories_json) : [] },
    templates: templates.map(t => ({ ...t, config: JSON.parse(t.config_json) })),
  });
});

app.post('/api/storefronts', authMiddleware, (req, res) => {
  const { slug, name, tagline, description, coverImage, logoImage, categories } = req.body;
  const id = randomUUID();
  db.prepare('INSERT INTO storefronts (id, owner_id, slug, name, tagline, description, cover_image, logo_image, categories_json) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, slug, name, tagline || '', description || '', coverImage || '', logoImage || '', JSON.stringify(categories || []));
  res.json({ id, slug });
});

/* ═══ MARKETPLACE — USER ASSETS ════════════════════════════ */
app.get('/api/assets', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT id, name, file_type, width, height, tags_json, created_at FROM user_assets WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ assets: rows.map(r => ({ ...r, tags: r.tags_json ? JSON.parse(r.tags_json) : [] })) });
});

/* ── MIME validation (C5) ─────────────────────────────────── */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
function validateMime(mime) {
  if (!mime || typeof mime !== 'string') return false;
  const normalized = mime.split(';')[0].trim().toLowerCase();
  return ALLOWED_MIME_TYPES.includes(normalized);
}

app.post('/api/assets', authMiddleware, (req, res) => {
  const { name, fileData, fileType, width, height, tags } = req.body;
  if (!validateMime(fileType)) {
    return res.status(400).json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG.' });
  }
  if (!fileData || typeof fileData !== 'string') {
    return res.status(400).json({ error: 'File data required.' });
  }
  const id = randomUUID();
  db.prepare('INSERT INTO user_assets (id, user_id, name, file_data, file_type, width, height, tags_json) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, name || 'Untitled', fileData, fileType.split(';')[0].trim(), width || 0, height || 0, JSON.stringify(tags || []));
  res.json({ id });
});

app.get('/api/assets/:id', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM user_assets WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Asset not found' });
  res.json({ asset: row });
});

app.delete('/api/assets/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM user_assets WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

/* ═══ MARKETPLACE — FAVORITES ══════════════════════════════ */
app.get('/api/favorites', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ favorites: rows });
});

app.post('/api/favorites', authMiddleware, (req, res) => {
  const { targetType, targetId } = req.body;
  const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?').get(req.user.id, targetType, targetId);
  if (existing) return res.json({ id: existing.id, existed: true });
  const id = randomUUID();
  db.prepare('INSERT INTO favorites (id, user_id, target_type, target_id) VALUES (?,?,?,?)').run(id, req.user.id, targetType, targetId);
  res.json({ id, existed: false });
});

app.delete('/api/favorites/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

/* ═══ MARKETPLACE — PRODUCT SUITES ═════════════════════════ */
app.get('/api/suites', (_req, res) => {
  const rows = db.prepare('SELECT * FROM product_suites WHERE is_active = 1 ORDER BY name').all();
  res.json({
    suites: rows.map(r => ({
      ...r,
      productIds: JSON.parse(r.product_ids_json),
      themeConfig: r.theme_config_json ? JSON.parse(r.theme_config_json) : {},
    })),
  });
});

app.get('/api/suites/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM product_suites WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Suite not found' });
  const productIds = JSON.parse(row.product_ids_json);
  const products = productIds.map(pid => db.prepare('SELECT * FROM products WHERE id = ?').get(pid)).filter(Boolean)
    .map(p => ({ ...p, customization_schema: JSON.parse(p.customization_schema_json), tags: p.tags_json ? JSON.parse(p.tags_json) : [] }));
  res.json({
    suite: { ...row, productIds, themeConfig: row.theme_config_json ? JSON.parse(row.theme_config_json) : {} },
    products,
  });
});

/* ═══ MARKETPLACE — REVIEWS ════════════════════════════════ */
app.get('/api/reviews', (req, res) => {
  const { productId, templateId, storefrontId } = req.query;
  let sql = 'SELECT r.*, u.name as author_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.is_approved = 1';
  const params = [];
  if (productId) { sql += ' AND r.product_id = ?'; params.push(productId); }
  if (templateId) { sql += ' AND r.template_id = ?'; params.push(templateId); }
  if (storefrontId) { sql += ' AND r.storefront_id = ?'; params.push(storefrontId); }
  sql += ' ORDER BY r.created_at DESC LIMIT 50';
  const reviews = db.prepare(sql).all(...params);

  let myPendingReview = null;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      let pendingSql = 'SELECT r.*, u.name as author_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.user_id = ? AND r.is_approved = 0';
      const pendingParams = [payload.id];
      if (productId) { pendingSql += ' AND r.product_id = ?'; pendingParams.push(productId); }
      if (templateId) { pendingSql += ' AND r.template_id = ?'; pendingParams.push(templateId); }
      if (storefrontId) { pendingSql += ' AND r.storefront_id = ?'; pendingParams.push(storefrontId); }
      myPendingReview = db.prepare(pendingSql).get(...pendingParams) || null;
    } catch { /* invalid token, ignore */ }
  }
  res.json({ reviews, myPendingReview });
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const { productId, templateId, storefrontId, rating, title, body, photoUrl } = req.body;
  const id = randomUUID();
  db.prepare('INSERT INTO reviews (id, user_id, product_id, template_id, storefront_id, rating, title, body, photo_url) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, productId || null, templateId || null, storefrontId || null, rating, title || '', body || '', photoUrl || '');
  res.json({ id });
});

/* ═══ MARKETPLACE — BULK JOBS ══════════════════════════════ */
app.post('/api/bulk-jobs', authMiddleware, (req, res) => {
  const { designId, productId, rows } = req.body;
  const id = randomUUID();
  db.prepare('INSERT INTO bulk_jobs (id, user_id, design_id, product_id, rows_json, total_rows) VALUES (?,?,?,?,?,?)')
    .run(id, req.user.id, designId, productId, JSON.stringify(rows), rows.length);
  res.json({ id, totalRows: rows.length });
});

app.get('/api/bulk-jobs', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM bulk_jobs WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ jobs: rows.map(r => ({ ...r, rows: JSON.parse(r.rows_json) })) });
});

app.get('/api/bulk-jobs/:id/files', authMiddleware, (req, res) => {
  const job = db.prepare('SELECT * FROM bulk_jobs WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!job) return res.status(404).json({ error: 'Bulk job not found' });
  const design = db.prepare('SELECT * FROM designs WHERE id = ? AND user_id = ?').get(job.design_id, req.user.id);
  if (!design) return res.status(404).json({ error: 'Design not found' });
  const baseConfig = JSON.parse(design.config_json);
  const rows = JSON.parse(job.rows_json);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="bulk-${job.id}.zip"`);

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(500).end();
  });
  archive.pipe(res);

  const productId = job.product_id;
  const product = db.prepare('SELECT customization_schema_json FROM products WHERE id = ?').get(productId);
  const schema = product?.customization_schema_json ? JSON.parse(product.customization_schema_json) : null;
  rows.forEach((row, i) => {
    const config = { ...baseConfig, ...row };
    const result = generateProductionFile(productId, config, schema);
    const fileList = result.files || [{ name: 'design.svg', content: '' }];
    fileList.forEach((f) => {
      archive.append(f.content, { name: `row_${i + 1}_${f.name}` });
    });
  });

  archive.finalize();
});

/* ═══ MARKETPLACE — DESIGN VERSIONING ══════════════════════ */
app.post('/api/designs/:id/duplicate', authMiddleware, (req, res) => {
  const original = db.prepare('SELECT * FROM designs WHERE id = ?').get(req.params.id);
  if (!original) return res.status(404).json({ error: 'Design not found' });
  const id = randomUUID();
  const shareToken = randomUUID().slice(0, 8);
  const targetProduct = req.body.targetProductId || original.product_id;
  db.prepare('INSERT INTO designs (id, user_id, share_token, product_id, config_json, name, version, parent_design_id, notes) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, shareToken, targetProduct, original.config_json, `${original.name} (copy)`, 1, original.id, req.body.notes || '');
  res.json({ id, shareToken });
});

app.get('/api/designs/:id/versions', authMiddleware, (req, res) => {
  const versions = db.prepare('SELECT id, name, version, notes, created_at FROM designs WHERE (id = ? OR parent_design_id = ?) AND user_id = ? ORDER BY version DESC')
    .all(req.params.id, req.params.id, req.user.id);
  res.json({ versions });
});

app.get('/api/designs/:id/production-files', authMiddleware, (req, res) => {
  const design = db.prepare('SELECT * FROM designs WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!design) return res.status(404).json({ error: 'Design not found' });
  const product = db.prepare('SELECT customization_schema_json FROM products WHERE id = ?').get(design.product_id);
  const schema = product?.customization_schema_json ? JSON.parse(product.customization_schema_json) : null;
  const format = req.query.format || 'all';
  const config = JSON.parse(design.config_json);
  try {
    const result = generateProductionFile(design.product_id, config, schema, format);
    const files = result.files || [];
    if (files.length === 0) return res.status(400).json({ error: 'No production files generated' });
    if (files.length === 1) {
      const f = files[0];
      const mime = f.name.endsWith('.dxf') ? 'application/dxf' : f.name.endsWith('.dst') ? 'application/octet-stream' : 'image/svg+xml';
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `attachment; filename="${f.name}"`);
      return res.send(f.content);
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="design-${design.id}-production.zip"`);
    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err) => { console.error(err); res.status(500).end(); });
    archive.pipe(res);
    files.forEach((f) => archive.append(f.content, { name: f.name }));
    archive.finalize();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ═══ MANUFACTURING VALIDATION ═══════════════════════════ */
app.post('/api/manufacturing/validate', (req, res) => {
  const { productId, config, productionProfile } = req.body;
  if (!productId || !config) {
    return res.status(400).json({ error: 'productId and config required' });
  }
  try {
    const result = validateForProduction(productId, config, productionProfile);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══ AI ORCHESTRATION (aiRateLimit: 20/min per IP) ═══ */
app.post('/api/ai/analyze-scene', aiRateLimit, (req, res) => {
  const { imageDataUrl } = req.body;
  if (!imageDataUrl || typeof imageDataUrl !== 'string') {
    return res.status(400).json({ error: 'imageDataUrl required' });
  }
  aiAnalyzeScene(imageDataUrl)
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('AI analyze-scene error:', err);
      res.status(500).json({ error: 'Scene analysis failed' });
    });
});

app.post('/api/ai/design-assistant', aiRateLimit, (req, res) => {
  const { message, productId, productName, productCategory, config, schema, conversationHistory } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }
  designAssistant({ message, productId, productName, productCategory, config, schema, conversationHistory })
    .then((result) => {
      if (!result) {
        return res.status(503).json({ error: 'OPENAI_API_KEY not configured', code: 'AI_UNAVAILABLE' });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error('Design assistant error:', err);
      res.status(500).json({ error: err.message || 'Design assistant failed' });
    });
});

app.post('/api/ai/generate-design', aiRateLimit, (req, res) => {
  const { prompt, productCategory, style } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt required' });
  }
  generateDesign({ prompt, productCategory, style })
    .then((result) => {
      if (!result) {
        return res.status(503).json({ error: 'OPENAI_API_KEY not configured', code: 'AI_UNAVAILABLE' });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error('Generative design error:', err);
      res.status(500).json({ error: err.message || 'Image generation failed' });
    });
});

app.post('/api/ai/machine-assistant', aiRateLimit, (req, res) => {
  const { message, machineId, material, selectedTool, layerCount, conversationHistory } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }
  machineAssistant({ message, machineId, material, selectedTool, layerCount, conversationHistory })
    .then((result) => {
      if (!result) {
        return res.status(503).json({ error: 'OPENAI_API_KEY not configured', code: 'AI_UNAVAILABLE' });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error('Machine assistant error:', err);
      res.status(500).json({ error: err.message || 'Machine assistant failed' });
    });
});

app.get('/api/crafting-studio/export', (req, res) => {
  const { machine } = req.query;
  const design = { layers: [] };
  let content, filename, mime;
  if (machine === 'curio2') {
    content = toCurioLayers(design);
    filename = 'design-curio.svg';
    mime = 'image/svg+xml';
  } else {
    content = toLightBurnSVG(design);
    filename = 'design-xtool.svg';
    mime = 'image/svg+xml';
  }
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
});

app.post('/api/crafting-studio/export', (req, res) => {
  const { machine, design } = req.body;
  const layers = (design?.layers || []).map((l) => ({
    type: l.type || 'cut',
    name: l.name || l.type,
    paths: l.paths || '',
  }));
  const designWithLayers = { layers };
  let content, filename, mime;
  if (machine === 'curio2') {
    content = toCurioLayers(designWithLayers);
    filename = 'design-curio.svg';
    mime = 'image/svg+xml';
  } else {
    content = toLightBurnSVG(designWithLayers);
    filename = 'design-xtool.svg';
    mime = 'image/svg+xml';
  }
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
});

/** Unified export: svg | dxf | curio | xtool. Preserves zones, scales, material intent. */
app.post('/api/export/design', (req, res) => {
  const { productId, config, schema, format = 'svg' } = req.body;
  const fmt = String(format || 'svg').toLowerCase();
  const cfg = config || {};
  try {
    const hasVectorPaths = cfg.vectorPath || cfg.paths || (cfg.layers?.length && cfg.layers.some((l) => l.paths));
    if ((fmt === 'curio2' || fmt === 'curio') && hasVectorPaths) {
      const design = { layers: (cfg.layers || [{ type: 'cut', name: 'design', paths: cfg.vectorPath || cfg.paths || '' }]) };
      const content = toCurioLayers(design);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', 'attachment; filename="design-curio.svg"');
      return res.send(content);
    }
    if ((fmt === 'xtool' || fmt === 'xtool-d1' || fmt === 'xtool-m1') && hasVectorPaths) {
      const design = { layers: (cfg.layers || [{ type: 'cut', name: 'design', paths: cfg.vectorPath || cfg.paths || '' }]) };
      const content = toLightBurnSVG(design);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', 'attachment; filename="design-xtool.svg"');
      return res.send(content);
    }
    const result = generateProductionFile(productId || 'craft-sign', cfg, schema, fmt === 'dxf' ? 'dxf' : 'svg');
    const files = result.files || [];
    if (files.length === 0) return res.status(400).json({ error: 'No files generated' });
    const f = files[0];
    const mime = f.name.endsWith('.dxf') ? 'application/dxf' : 'image/svg+xml';
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${f.name}"`);
    res.send(f.content);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

/* ═══ HEALTH ═══════════════════════════════════════════════ */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), dbTables: 15 });
});

app.post('/api/dev/seed-products', (req, res) => {
  try {
    const result = runProductSeed();
    res.json(result);
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ═══ WebSocket (Socket.io) for Studio Collaboration ═══════ */
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'] },
});

io.on('connection', (socket) => {
  socket.on('studio:join', (designId) => {
    if (designId) socket.join(designId);
  });
  socket.on('studio:leave', (designId) => {
    if (designId) socket.leave(designId);
  });
  socket.on('studio:update', (designId, delta) => {
    if (designId) socket.to(designId).emit('design:updated', delta);
  });
});

/* ═══ START ═════════════════════════════════════════════════ */
httpServer.listen(PORT, () => {
  console.log(`\n  🚀 ADEA Crafts API Server`);
  console.log(`  ─────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log(`  DB:      server/data.db\n`);
});

/**
 * Product seed runner — reseeds mass catalog. Core products come from db.js on startup.
 */
import db from './db.js';
import { generateProducts } from './products_seed.js';

export function runProductSeed() {
  const massProducts = generateProducts();
  const ins = db.prepare('INSERT OR REPLACE INTO products (id, slug, name, category, subcategory, description, base_price, hero_image, customization_schema_json, pricing_rules_json, is_quote_only, supports_bulk, estimated_days, tags_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
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
    const total = db.prepare('SELECT COUNT(*) as c FROM products').get();
    return { seeded: true, massCount: massProducts.length, total: total.c };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

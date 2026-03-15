/**
 * Specialized machine mockups for Curio 2 and xTool lasers.
 * Drops these directly into the products table so they can be edited in the AI studio.
 */
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'server', 'data.db');
const db = new DatabaseSync(dbPath);

const products = [
  {
    id: `machine-curio-journal-${Date.now()}`,
    slug: 'curio-embossed-journal',
    name: 'Curio 2: Embossed Leather Journal',
    category: 'notebooks',
    subcategory: 'leather-goods',
    description: 'A premium leather journal customized via Silhouette Curio 2 tooling.',
    base_price: 45.00,
    hero_image: '/machine_mockups/curio_leather_journal_1773582708297.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'cover', label: 'Journal Cover' }],
      fields: [
        { id: 'artwork', type: 'image', label: 'Upload Tooling Art' },
        { id: 'text', type: 'text', label: 'Embossing Text' },
        { id: 'font', type: 'font-picker', label: 'Font Style' }
      ],
      preview: { type: 'product-overlay', blendMode: 'multiply', opacity: 0.85 }
    }),
    pricing: JSON.stringify({ type: 'fixed' }),
    tags: JSON.stringify(['curio2', 'embossing', 'leather', 'notebook'])
  },
  {
    id: `machine-curio-dogtag-${Date.now()}`,
    slug: 'curio-stippled-dog-tag',
    name: 'Curio 2: Stippled Metal Dog Tag',
    category: 'jewelry',
    subcategory: 'dog-tags',
    description: 'Custom silver dog tag, stippled and etched with the Curio 2.',
    base_price: 25.00,
    hero_image: '/machine_mockups/curio_metal_dog_tag_1773582724810.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'front', label: 'Front Face' }],
      fields: [
        { id: 'text', type: 'text', label: 'Line 1 (Name)', maxLen: 16 },
        { id: 'text2', type: 'text', label: 'Line 2 (Info)', maxLen: 16 },
        { id: 'artwork', type: 'image', label: 'Upload SVG/Stipple Image' }
      ],
      preview: { type: 'product-overlay', blendMode: 'overlay', filter: 'grayscale(1) contrast(1.5)' }
    }),
    pricing: JSON.stringify({ type: 'fixed' }),
    tags: JSON.stringify(['curio2', 'stippling', 'metal', 'dog-tag'])
  },
  {
    id: `machine-curio-foil-${Date.now()}`,
    slug: 'curio-foil-invitation',
    name: 'Curio 2: Gold Foil Invitation',
    category: 'weddings',
    subcategory: 'invitations',
    description: 'Navy cardstock invitation with stunning gold foil details stamped by Curio 2 power tool.',
    base_price: 6.50,
    hero_image: '/machine_mockups/curio_foil_invite_1773582740725.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'center', label: 'Foil Area' }],
      fields: [
        { id: 'text', type: 'textarea', label: 'Event Details' },
        { id: 'font', type: 'font-picker', label: 'Typography' }
      ],
      preview: { type: 'product-overlay', color: '#d4af37', blendMode: 'screen' }
    }),
    pricing: JSON.stringify({ tiers: [{min: 10, discount: 0.1}, {min: 50, discount: 0.2}] }),
    tags: JSON.stringify(['curio2', 'foil', 'wedding', 'stationery'])
  },
  {
    id: `machine-xtool-coaster-${Date.now()}`,
    slug: 'xtool-slate-coaster',
    name: 'xTool: Engraved Slate Coaster',
    category: 'kitchen',
    subcategory: 'coasters',
    description: 'Premium dark slate coaster etched perfectly via xTool diode or CO2 laser.',
    base_price: 12.00,
    hero_image: '/machine_mockups/xtool_slate_coaster_1773582768639.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'top', label: 'Top Surface', zones: [{id: 'center', w: '60%', h: '60%', x: '20%', y: '20%'}] }],
      fields: [
        { id: 'artwork', type: 'image', label: 'Upload Logo/Vector' },
        { id: 'text', type: 'text', label: 'Add Name/Date' }
      ],
      preview: { type: 'product-overlay', blendMode: 'screen', filter: 'brightness(2)' }
    }),
    pricing: JSON.stringify({ tiers: [{min: 4, discount: 0.1}, {min: 20, discount: 0.25}] }),
    tags: JSON.stringify(['xtool', 'slate', 'engraving', 'coaster', 'laser'])
  },
  {
    id: `machine-xtool-mandala-${Date.now()}`,
    slug: 'xtool-wood-mandala',
    name: 'xTool: Layered Wood Mandala Art',
    category: 'decor',
    subcategory: 'wall-art',
    description: 'Intricate multi-layered wood art laser-cut and engraved via xTool P2.',
    base_price: 115.00,
    hero_image: '/machine_mockups/xtool_wood_mandala_1773582790233.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'center', label: 'Center Plaque (Engravable)' }],
      fields: [
        { id: 'text', type: 'text', label: 'Center Monogram/Text' },
        { id: 'font', type: 'font-picker', label: 'Monogram Font' }
      ],
      preview: { type: 'product-overlay', blendMode: 'multiply', opacity: 0.9 }
    }),
    pricing: JSON.stringify({ type: 'fixed' }),
    tags: JSON.stringify(['xtool', 'wood', 'laser-cut', 'decor', 'layered'])
  },
  {
    id: `machine-xtool-board-${Date.now()}`,
    slug: 'xtool-cutting-board',
    name: 'xTool: Custom Bamboo Cutting Board',
    category: 'kitchen',
    subcategory: 'cutting-boards',
    description: 'Thick bamboo cutting board brilliantly laser engraved using an xTool laser.',
    base_price: 55.00,
    hero_image: '/machine_mockups/xtool_cutting_board_1773582817166.png',
    schema: JSON.stringify({
      surfaces: [{ id: 'face', label: 'Cutting Board Face' }],
      fields: [
        { id: 'artwork', type: 'image', label: 'Upload Family Recipe or Design' },
        { id: 'text', type: 'textarea', label: 'Bottom Engraving' }
      ],
      preview: { type: 'product-overlay', blendMode: 'multiply', filter: 'sepia(1) hue-rotate(-30deg)' }
    }),
    pricing: JSON.stringify({ type: 'fixed' }),
    tags: JSON.stringify(['xtool', 'bamboo', 'engraving', 'kitchen', 'laser'])
  }
];

const insert = db.prepare('INSERT INTO products (id, slug, name, category, subcategory, description, base_price, hero_image, customization_schema_json, pricing_rules_json, is_active, tags_json, supports_bulk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 1)');

try {
  for (const p of products) {
    insert.run(p.id, p.slug, p.name, p.category, p.subcategory, p.description, p.base_price, p.hero_image, p.schema, p.pricing, p.tags);
    console.log(`Inserted ${p.name}`);
  }
  console.log('Successfully seeded machine products.');
} catch (e) {
  console.error("Failed to seed:", e);
} finally {
  db.close();
}

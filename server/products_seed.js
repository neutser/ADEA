/**
 * Massive Catalog Seed for Adea Crafts
 * Generates 250+ Zazzle & Geschenkidee-inspired customizable products
 */

const categories = [
  {
    id: 'apparel',
    name: 'Apparel',
    subcategories: [
      { id: 't-shirts', name: 'Premium T-Shirts', base_price: 22, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
      { id: 'hoodies', name: 'Cozy Hoodies', base_price: 45, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600' },
      { id: 'polos', name: 'Elite Polos', base_price: 32, image: 'https://images.unsplash.com/photo-1625910513413-5fc28e44362e?w=600' },
      { id: 'caps', name: 'Snapback Caps', base_price: 25, image: 'https://images.unsplash.com/photo-1588850567047-1845a9eeadc7?w=600' },
      { id: 'socks', name: 'Custom Printed Socks', base_price: 15, image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600' },
    ],
    schema_template: 'garment'
  },
  {
    id: 'home',
    name: 'Home & Living',
    subcategories: [
      { id: 'pillows', name: 'Custom Pillows', base_price: 35, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600' },
      { id: 'blankets', name: 'Luxury Blankets', base_price: 65, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600' },
      { id: 'clocks', name: 'Modern Clocks', base_price: 40, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600' },
      { id: 'posters', name: 'Wall Posters', base_price: 15, image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600' },
      { id: 'candles', name: 'Engraved Candles', base_price: 24, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600' },
    ],
    schema_template: 'product-overlay'
  },
  {
    id: 'tech',
    name: 'Tech Accessories',
    subcategories: [
      { id: 'phone-cases', name: 'Tough Cases', base_price: 30, image: 'https://images.unsplash.com/photo-1586944237566-6f60058b6da4?w=600' },
      { id: 'sleeves', name: 'Laptop Sleeves', base_price: 45, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600' },
      { id: 'mousepads', name: 'Gaming Mousepads', base_price: 20, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600' },
      { id: 'airpods', name: 'AirPod Cases', base_price: 18, image: 'https://images.unsplash.com/photo-1603351154341-da825950d97a?w=600' },
    ],
    schema_template: 'flat'
  },
  {
    id: 'gifts',
    name: 'Personalized Gifts',
    subcategories: [
      { id: 'knives', name: 'Engraved Knives (Swiss style)', base_price: 48, image: 'https://images.unsplash.com/photo-1594050215750-f8ec00361099?w=600' },
      { id: 'lighters', name: 'Branded Lighters', base_price: 35, image: 'https://images.unsplash.com/photo-1582133637202-fca1dd37fc38?w=600' },
      { id: 'jewelry', name: 'Engraved Jewelry', base_price: 75, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?w=600' },
      { id: 'mugs', name: 'Photo Mugs', base_price: 16, image: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=600' },
      { id: 'wine-boxes', name: 'Personalized Wine Boxes', base_price: 28, image: 'https://images.unsplash.com/photo-1584916201218-f3b140cd43d4?w=600' },
    ],
    schema_template: 'engraved'
  },
  {
    id: 'stationery',
    name: 'Stationery & Office',
    subcategories: [
      { id: 'notebooks', name: 'Spiral Notebooks', base_price: 18, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600' },
      { id: 'pens', name: 'Engraved Luxury Pens', base_price: 45, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600' },
      { id: 'stamps', name: 'Custom Stamps', base_price: 22, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600' },
      { id: 'desk-plaques', name: 'Glass Desk Plaques', base_price: 38, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600' },
    ],
    schema_template: 'card'
  },
  {
    id: 'signs',
    name: 'Signs & Decor',
    subcategories: [
      { id: 'neon', name: 'Custom Neon Signs', base_price: 180, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600' },
      { id: 'acrylic', name: 'Acrylic Business Signs', base_price: 120, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=600' },
      { id: 'wood-sign', name: 'Rustic Wood Signs', base_price: 65, image: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=600' },
    ],
    schema_template: 'sign'
  },
  {
    id: 'awards',
    name: 'Awards & Trophies',
    subcategories: [
      { id: 'award', name: 'Crystal Excellence Award', base_price: 85, image: 'https://images.unsplash.com/photo-1578328819058-b69f3a709475?w=600' },
      { id: 'trophy', name: 'Victory Cup Trophy', base_price: 45, image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600' },
      { id: 'plaque', name: 'Executive Wall Plaque', base_price: 55, image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=600' },
    ],
    schema_template: 'award'
  },
  {
    id: 'glassware',
    name: 'Premium Glassware',
    subcategories: [
      { id: 'wine', name: 'Monogrammed Wine Glass', base_price: 24, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600' },
      { id: 'whiskey', name: 'Custom Whiskey Decanter', base_price: 89, image: 'https://images.unsplash.com/photo-1527281400828-ac737a999b1c?w=600' },
      { id: 'beer', name: 'Etched Beer Mug', base_price: 18, image: 'https://images.unsplash.com/photo-1538944747593-70c30c336916?w=600' },
    ],
    schema_template: 'glass'
  },
  {
    id: 'luxury',
    name: 'Luxury Goods',
    subcategories: [
      { id: 'journal', name: 'Leather Bound Journal', base_price: 55, image: 'https://images.unsplash.com/photo-1517842645537-4d25830b2f5a?w=600' },
      { id: 'box', name: 'Engraved Keepsake Box', base_price: 65, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600' },
    ],
    schema_template: 'box'
  }
];

export function generateProducts() {
  const products = [];
  const itemsPerSubcategory = 10; 

  categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      for (let i = 1; i <= itemsPerSubcategory; i++) {
        const id = `mass-${cat.id}-${sub.id}-${i}`;
        const name = `${sub.name} Design #${i}`;
        const slug = `${cat.id}-${sub.id}-design-${i}`;
        
        let schema = {};
        if (cat.schema_template === 'garment') {
          schema = {
            surfaces: [
              { id: 'front', label: 'Front', zones: [{ id: 'main', x: '25%', y: '20%', w: '50%', h: '40%' }] },
              { id: 'back', label: 'Back', zones: [{ id: 'main', x: '25%', y: '20%', w: '50%', h: '40%' }] }
            ],
            fields: [
              { id: 'color', type: 'color-swatch', label: 'Garment Color', options: [{ id: 'black', hex: '#111' }, { id: 'white', hex: '#eee' }, { id: 'navy', hex: '#1a2744' }] },
              { id: 'text', type: 'text', label: 'Custom Text' },
              { id: 'logo', type: 'image', label: 'Upload Design' }
            ],
            preview: { type: 'garment-overlay' }
          };
        } else if (cat.schema_template === 'engraved') {
          schema = {
            surfaces: [{ id: 'front', label: 'Surface' }],
            fields: [
              { id: 'text', type: 'text', label: 'Line 1 (Text)', maxLen: 24, placeholder: 'Name or Message' },
              { id: 'text2', type: 'text', label: 'Line 2 (Optional)', required: false },
              { id: 'font', type: 'font-picker', label: 'Engraving Style' },
              { id: 'icon', type: 'icon-picker', label: 'Symbol Overlay' }
            ],
            preview: { type: 'product-overlay', background: 'wood' }
          };
        } else if (cat.schema_template === 'product-overlay') {
          schema = {
            surfaces: [{ id: 'wrap', label: 'Main Area' }],
            fields: [
              { id: 'artwork', type: 'image', label: 'Photo/Design' },
              { id: 'text', type: 'text', label: 'Overlay Text', required: false }
            ],
            preview: { type: 'product-overlay' }
          };
        } else if (cat.schema_template === 'sign') {
          schema = {
            surfaces: [{ id: 'front', label: 'Face' }],
            fields: [
              { id: 'text', type: 'text', label: 'Sign Text', placeholder: 'OPEN' },
              { id: 'color', type: 'color-swatch', label: 'Neon/Light Color', options: [{ id: 'cyan', hex: '#00f0ff' }, { id: 'pink', hex: '#ff00ff' }, { id: 'yellow', hex: '#ffff00' }] },
              { id: 'font', type: 'font-picker', label: 'Script Style' }
            ],
            preview: { type: '3d-neon' }
          };
        } else if (cat.schema_template === 'award') {
          schema = {
            surfaces: [{ id: 'front', label: 'Base/Plate' }],
            fields: [
              { id: 'recipient', type: 'text', label: 'Recipient Name' },
              { id: 'title', type: 'text', label: 'Award Title' },
              { id: 'year', type: 'number', label: 'Year', defaultValue: new Date().getFullYear() }
            ],
            preview: { type: '3d-award' }
          };
        } else if (cat.schema_template === 'glass') {
          schema = {
            surfaces: [{ id: 'front', label: 'Side A' }],
            fields: [
              { id: 'initials', type: 'text', label: 'Initials', maxLen: 3 },
              { id: 'etching', type: 'image', label: 'Custom Artwork' }
            ],
            preview: { type: '3d-glass' }
          };
        } else if (cat.schema_template === 'box' || cat.schema_template === 'luxury') {
          schema = {
            surfaces: [{ id: 'lid', label: 'Lid' }],
            fields: [
              { id: 'engraving', type: 'text', label: 'Memorial Text' },
              { id: 'material', type: 'select', label: 'Wood Finish', options: ['Walnut', 'Oak', 'Cherry'] }
            ],
            preview: { type: '3d-box' }
          };
        } else {
          schema = {
            surfaces: [{ id: 'front', label: 'Front' }, { id: 'back', label: 'Back' }],
            fields: [
              { id: 'artwork', type: 'image', label: 'Front Visual' },
              { id: 'back_text', type: 'text', label: 'Back Note', required: false }
            ],
            preview: { type: 'multi-surface-card' }
          };
        }

        products.push({
          id, slug, name,
          category: cat.id,
          subcategory: sub.id,
          description: `Professional scale ${sub.name.toLowerCase()} for the global marketplace. Premium ${cat.name} with deep customization.`,
          base_price: sub.base_price + (i * 0.5),
          hero_image: sub.image,
          schema,
          pricing: { type: 'fixed' },
          quoteOnly: 0,
          bulk: 1,
          days: 2 + (i % 4),
          tags: [cat.id, sub.id, 'premium', 'geschenkidee']
        });
      }
    });
  });

  return products;
}

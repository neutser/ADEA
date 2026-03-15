import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PenTool, Layers, Shirt, Heart, Gift, Sticker, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { API_BASE } from '@/config';

const CATEGORY_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  signs: { icon: <PenTool size={24} />, label: 'Business Signs', color: '#00f0ff' },
  crafts: { icon: <Layers size={24} />, label: 'Crafts & Keychains', color: '#00ff88' },
  apparel: { icon: <Shirt size={24} />, label: 'Apparel & Clothing', color: '#ff9900' },
  wedding: { icon: <Heart size={24} />, label: 'Wedding & Events', color: '#ff6b9d' },
  gifts: { icon: <Gift size={24} />, label: 'Personalized Gifts', color: '#b026ff' },
  stickers: { icon: <Sticker size={24} />, label: 'Stickers & Labels', color: '#ffcc00' },
  stationery: { icon: <FileText size={24} />, label: 'Stationery', color: '#4ecdc4' },
};

const SCENE_CAPABLE_PRODUCTS = ['sign-3d-logo', 'mock-sign-1'];

export default function DesignFlow() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = params.get('category') || '';

  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/categories/list`)
      .then(r => r.json())
      .then(data => {
        const cats = data.categories || [];
        setCategories(cats.length > 0 ? cats : ['signs', 'crafts', 'apparel', 'wedding', 'gifts', 'stickers', 'stationery']);
        if (initialCategory && cats.includes(initialCategory)) {
          setSelectedCategory(initialCategory);
        }
      })
      .catch(() => setCategories(['signs', 'crafts', 'apparel', 'wedding', 'gifts', 'stickers', 'stationery']))
      .finally(() => setLoading(false));
  }, [initialCategory]);

  useEffect(() => {
    if (!selectedCategory) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/products?category=${selectedCategory}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleProductSelect = (product: { id: string; slug?: string }) => {
    const productId = product.id || product.slug;
    if (!productId) return;
    
    if (SCENE_CAPABLE_PRODUCTS.includes(productId)) {
      navigate(`/ai-builder?product=${productId}`);
    } else {
      navigate(`/marketplace/configure?product=${productId}`);
    }
  };

  return (
    <>
      <PageMeta
        title="Start Designing"
        description="Pick a category and product to start customizing. Signs support AI scene preview."
      />
      <div className="section" style={{ minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--accent-neon-blue)',
              marginBottom: 32,
              fontSize: '0.95rem',
            }}
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--accent-neon-blue)' }}>
              <Sparkles size={14} /> Unified Design Flow
            </div>
            <h1 className="heading-lg" style={{ marginBottom: 12 }}>Start Designing</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>
              Pick a category, then choose a product to customize. Signs support AI scene preview—upload a photo of your space and see your sign in place.
            </p>
          </motion.div>

          {/* Step 1: Category selection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ marginBottom: 40 }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Step 1 — Pick a category</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {categories.map(cat => {
                const meta = CATEGORY_META[cat] || { icon: <Layers size={24} />, label: cat, color: '#888' };
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 20px',
                      borderRadius: 12,
                      border: `2px solid ${isSelected ? meta.color : 'var(--border-color)'}`,
                      background: isSelected ? `${meta.color}15` : 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 500,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ color: meta.color }}>{meta.icon}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Step 2: Product grid */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Step 2 — Pick a product</h2>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                  <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
              ) : products.length === 0 ? (
                <div className="card glass-panel" style={{ padding: 48, textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No products in this category yet.</p>
                  <Link to="/marketplace" className="btn btn-outline">Browse Marketplace</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                  {products.map((p, i) => {
                    const meta = CATEGORY_META[p.category] || { color: '#888' };
                    const isSceneCapable = SCENE_CAPABLE_PRODUCTS.includes(p.id);
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="card glass-panel"
                        style={{
                          padding: 0,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '1px solid var(--border-color)',
                        }}
                        onClick={() => handleProductSelect(p)}
                      >
                        <div
                          style={{
                            height: 160,
                            background: `url(${p.hero_image || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80'}) center/cover`,
                            position: 'relative',
                          }}
                        >
                          {isSceneCapable && (
                            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,240,255,0.9)', color: '#000', padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700 }}>
                              AI Scene Preview
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{p.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
                            {p.description?.slice(0, 80)}{p.description?.length > 80 ? '...' : ''}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, color: meta.color }}>From ${p.base_price}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--accent-neon-blue)' }}>
                              Customize <ArrowRight size={16} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: 48, textAlign: 'center' }}
          >
            <Link to="/design-wizard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Or try the guided Design Wizard for AI recommendations
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

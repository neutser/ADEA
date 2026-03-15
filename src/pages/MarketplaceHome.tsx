import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Sparkles, ShoppingBag, Layers, ArrowRight, Heart,
  Package, Gift, Shirt, PenTool, Sticker, FileText, Tag,
} from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import type { MarketplaceProduct } from '@/services/CustomizationEngine';

import { API_BASE } from '@/config';
const API = API_BASE;

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; emoji: string }> = {
  signs: { icon: <PenTool size={18} />, color: '#00f0ff', emoji: '🏢' },
  crafts: { icon: <Layers size={18} />, color: '#00ff88', emoji: '✂️' },
  apparel: { icon: <Shirt size={18} />, color: '#ff9900', emoji: '👕' },
  wedding: { icon: <Heart size={18} />, color: '#ff6b9d', emoji: '💒' },
  gifts: { icon: <Gift size={18} />, color: '#b026ff', emoji: '🎁' },
  stickers: { icon: <Sticker size={18} />, color: '#ffcc00', emoji: '🏷️' },
  stationery: { icon: <FileText size={18} />, color: '#4ecdc4', emoji: '📇' },
  home: { icon: <Package size={18} />, color: '#ff5733', emoji: '🏠' },
  tech: { icon: <Sparkles size={18} />, color: '#00f0ff', emoji: '💻' },
};

const MarketplaceHome = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [suites, setSuites] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setFetchError(null);
    Promise.all([
      fetch(`${API}/api/products`).then(r => r.ok ? r.json() : { products: [] }),
      fetch(`${API}/api/suites`).then(r => r.ok ? r.json() : { suites: [] }),
    ])
      .then(([prodData, suiteData]) => {
        setProducts(prodData?.products || []);
        setSuites(suiteData?.suites || []);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Could not load products. Ensure the server is running (npm run server).');
        setProducts([]);
        setSuites([]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())));
    return list;
  }, [products, filterCat, search]);

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Create Your Own — Marketplace" description="Browse and customize signs, gifts, apparel, stationery and more. Start from scratch or use a template." />
      <div className="section" style={{ minHeight: '100vh' }}>
        <div className="container">

          {/* ── Hero ────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--accent-neon-blue)' }}>
              <Sparkles size={14} /> AI-Powered Product Studio
            </div>
            <h1 className="heading-lg" style={{ fontSize: '2.5rem', marginBottom: 12 }}>
              Create <span className="text-gradient-accent">Your Own</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 620, margin: '0 auto 24px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Personalize any product with our intelligent design studio. Start from scratch, use a template, or upload your artwork.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <Link to="/design" className="btn btn-primary" style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} /> Guided Design Flow
              </Link>
              <Link to="/marketplace/storefronts" style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', textDecoration: 'none' }}>Storefronts</Link>
              <Link to="/marketplace/assets" style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', textDecoration: 'none' }}>My Assets</Link>
              <Link to="/marketplace/favorites" style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', textDecoration: 'none' }}>Favorites</Link>
            </div>

            {/* Search */}
            <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, categories, or tags..." style={{ paddingLeft: 44, width: '100%', fontSize: '1rem', padding: '14px 16px 14px 44px' }} />
            </div>
          </motion.div>

          {/* ── Category pills ──────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
            <button onClick={() => setFilterCat('all')} style={{ padding: '10px 20px', borderRadius: 20, background: filterCat === 'all' ? 'var(--accent-neon-blue)' : 'var(--bg-elevated)', border: `1px solid ${filterCat === 'all' ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`, cursor: 'pointer', color: filterCat === 'all' ? '#000' : 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              All Products
            </button>
            {categories.map(cat => {
              const meta = CATEGORY_META[cat] || { emoji: '📦', color: '#888' };
              return (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '10px 20px', borderRadius: 20, background: filterCat === cat ? `${meta.color}22` : 'var(--bg-elevated)', border: `1px solid ${filterCat === cat ? meta.color : 'var(--border-color)'}`, cursor: 'pointer', color: 'var(--text-primary)', fontWeight: filterCat === cat ? 600 : 400, fontSize: '0.9rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
                  {meta.emoji} {cat}
                </button>
              );
            })}
          </div>

          {/* ── Product Suites ──────────────────────────── */}
          {filterCat === 'all' && suites.length > 0 && !search && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={20} color="var(--accent-neon-blue)" /> Matching Product Suites
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {suites.map(suite => (
                  <Link key={suite.id} to={`/marketplace/suites/${suite.id}`} className="card glass-panel" style={{ padding: 20, textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,240,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layers size={20} color="var(--accent-neon-blue)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{suite.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{suite.productIds?.length || 0} products</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{suite.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>
                      Customize Suite <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Products Grid ──────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {visibleProducts.map((p, i) => {
              const meta = CATEGORY_META[p.category] || { color: '#888', emoji: '📦' };
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 12) * 0.05 }}>
                  <Link to={`/marketplace/configure?product=${p.id || p.slug}`} className="card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', border: '1px solid var(--border-color)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 160, background: `url(${p.hero_image}) center/cover`, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 10, left: 10 }}>
                        <FavoriteButton targetType="product" targetId={p.id} size={18} />
                      </div>
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: 12, fontSize: '0.72rem', color: meta.color, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5, backdropFilter: 'blur(5px)' }}>
                        {p.category}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12, flex: 1 }}>
                        {p.description.slice(0, 90)}{p.description.length > 90 ? '...' : ''}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-neon-blue)' }}>From ${p.base_price}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>~{p.estimated_days} days</span>
                      </div>
                      {p.supports_bulk === 1 && (
                        <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#00ff88', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Tag size={10} /> Bulk discounts available
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="btn btn-outline"
                style={{ padding: '12px 32px', fontSize: '1rem' }}
              >
                Load More Products ({filtered.length - visibleCount} remain)
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <h3 className="heading-md">{fetchError ? 'Products unavailable' : 'No products found'}</h3>
              <p>{fetchError || 'Try a different search or category.'}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MarketplaceHome;

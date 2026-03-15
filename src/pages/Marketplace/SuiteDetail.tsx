import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowRight, Layers } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { API_BASE } from '@/config';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  hero_image?: string;
  base_price?: number;
  category?: string;
}

interface Suite {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  themeConfig?: Record<string, unknown>;
}

const SuiteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [suite, setSuite] = useState<Suite | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/suites/${id}`)
      .then(r => r.json())
      .then(data => {
        setSuite(data.suite || null);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!suite) {
    return (
      <div className="section" style={{ minHeight: '60vh', textAlign: 'center', padding: 60 }}>
        <h2 className="heading-md">Suite not found</h2>
        <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={suite.name} description={suite.description} />
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card glass-panel" style={{ padding: 32, marginBottom: 40, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(0,240,255,0.1)', marginBottom: 16 }}>
              <Package size={32} color="var(--accent-neon-blue)" />
            </div>
            <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 12 }}>{suite.name}</h1>
            {suite.description && <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>{suite.description}</p>}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 12 }}>{products.length} matching products</p>
          </motion.div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={20} color="var(--accent-neon-blue)" /> Products in this suite
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/marketplace/configure?product=${p.slug || p.id}`} className="card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border-color)', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ height: 160, background: p.hero_image ? `url(${p.hero_image}) center/cover` : 'var(--bg-elevated)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 10, left: 10 }} onClick={e => e.preventDefault()}>
                      <FavoriteButton targetType="product" targetId={p.id} size={18} />
                    </div>
                  </div>
                  <div style={{ padding: 18, flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{p.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{p.description?.slice(0, 90)}{p.description && p.description.length > 90 ? '...' : ''}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-neon-blue)' }}>From ${p.base_price ?? 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>
                        Customize <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <Layers size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No products in this suite.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuiteDetailPage;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, ArrowLeft, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { API_BASE } from '@/config';

interface Template {
  id: string;
  name: string;
  description?: string;
  preview_image?: string;
  product_id?: string;
  config?: Record<string, unknown>;
}

interface StorefrontDetail {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  cover_image?: string;
  logo_image?: string;
  branding?: Record<string, unknown>;
  categories?: string[];
}

const StorefrontDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [storefront, setStorefront] = useState<StorefrontDetail | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/api/storefronts/${slug}`)
      .then(r => r.json())
      .then(data => {
        setStorefront(data.storefront || null);
        setTemplates(data.templates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!storefront) {
    return (
      <div className="section" style={{ minHeight: '60vh', textAlign: 'center', padding: 60 }}>
        <h2 className="heading-md">Storefront not found</h2>
        <Link to="/marketplace/storefronts" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Storefronts</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={storefront.name} description={storefront.tagline || storefront.description} />
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container">
          <Link to="/marketplace/storefronts" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 24, textDecoration: 'none', fontSize: '0.9rem' }}>
            <ArrowLeft size={18} /> Back to Storefronts
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card glass-panel" style={{ padding: 32, marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: storefront.cover_image ? `url(${storefront.cover_image}) center/cover` : 'rgba(0,240,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              {storefront.logo_image ? <img src={storefront.logo_image} alt="" style={{ maxWidth: 70, maxHeight: 70, objectFit: 'contain' }} /> : <Store size={40} color="var(--accent-neon-blue)" />}
            </div>
            <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 8 }}>{storefront.name}</h1>
            {storefront.tagline && <p style={{ fontSize: '1.1rem', color: 'var(--accent-neon-blue)', marginBottom: 12 }}>{storefront.tagline}</p>}
            {storefront.description && <p style={{ color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6 }}>{storefront.description}</p>}
          </motion.div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PenTool size={20} color="var(--accent-neon-blue)" /> Templates
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {templates.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/marketplace/configure?product=${t.product_id || ''}&template=${t.id}`} className="card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border-color)', transition: 'all 0.2s' }}>
                  <div style={{ height: 140, background: t.preview_image ? `url(${t.preview_image}) center/cover` : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!t.preview_image && <PenTool size={36} color="var(--text-muted)" style={{ opacity: 0.5 }} />}
                  </div>
                  <div style={{ padding: 14 }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{t.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.description?.slice(0, 60)}{t.description && t.description.length > 60 ? '...' : ''}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {templates.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <PenTool size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No templates in this storefront yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StorefrontDetailPage;

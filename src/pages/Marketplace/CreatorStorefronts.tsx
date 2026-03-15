import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { API_BASE } from '@/config';

interface Storefront {
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

const CreatorStorefronts = () => {
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/storefronts`)
      .then(r => r.json())
      .then(data => {
        setStorefronts(data.storefronts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Creator Storefronts" description="Browse creator-curated storefronts and templates." />
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--accent-neon-blue)' }}>
              <Sparkles size={14} /> Creator Collections
            </div>
            <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 8 }}>Creator Storefronts</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>Explore curated collections from our creators. Each storefront offers unique templates and designs.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {storefronts.map((sf, i) => (
              <motion.div key={sf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/marketplace/storefronts/${sf.slug}`} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid var(--border-color)', transition: 'all 0.2s', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }} onClick={e => e.preventDefault()}>
                    <FavoriteButton targetType="storefront" targetId={sf.id} size={18} />
                  </div>
                  <div style={{ height: 160, background: sf.cover_image ? `url(${sf.cover_image}) center/cover` : 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,255,136,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sf.logo_image ? (
                      <img src={sf.logo_image} alt="" style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }} />
                    ) : (
                      <Store size={48} color="var(--accent-neon-blue)" style={{ opacity: 0.6 }} />
                    )}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>{sf.name}</h3>
                    {sf.tagline && <p style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', marginBottom: 8 }}>{sf.tagline}</p>}
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{sf.description?.slice(0, 100)}{sf.description && sf.description.length > 100 ? '...' : ''}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>
                      View Storefront <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {storefronts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <Store size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <h3 className="heading-md">No storefronts yet</h3>
              <p>Creator storefronts will appear here when available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorStorefronts;

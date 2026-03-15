import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface Favorite {
  id: string;
  target_type: string;
  target_id: string;
  created_at?: string;
}

const FavoritesPage = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [products, setProducts] = useState<Record<string, { name: string; slug: string; hero_image?: string; base_price?: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login?redirect=/marketplace/favorites');
      return;
    }
    fetch(`${API_BASE}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const favs = (data.favorites || []) as Favorite[];
        setFavorites(favs);
        const productIds = [...new Set(favs.filter((f) => f.target_type === 'product').map((f) => f.target_id))] as string[];
        if (productIds.length) {
          Promise.all(productIds.map((id) => fetch(`${API_BASE}/api/products/${id}`).then(r => r.json())))
            .then(results => {
              const map: Record<string, { name: string; slug: string; hero_image?: string; base_price?: number }> = {};
              results.forEach(r => {
                const p = r.product;
                if (p) map[p.id] = { name: p.name, slug: p.slug || p.id, hero_image: p.hero_image, base_price: p.base_price };
              });
              setProducts(map);
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, token, navigate]);

  const removeFavorite = (id: string) => {
    if (!token) return;
    fetch(`${API_BASE}/api/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => { if (r.ok) setFavorites(prev => prev.filter(f => f.id !== id)); });
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const productFavs = favorites.filter(f => f.target_type === 'product');
  const otherFavs = favorites.filter(f => f.target_type !== 'product');

  return (
    <>
      <PageMeta title="My Favorites" description="Your saved products and designs." />
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Heart size={28} fill="var(--accent-red)" color="var(--accent-red)" /> My Favorites
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Products and items you've saved for later.</p>
          </motion.div>

          {productFavs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {productFavs.map((fav, i) => {
                const p = products[fav.target_id];
                return (
                  <motion.div key={fav.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <button onClick={() => removeFavorite(fav.id)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff' }} title="Remove from favorites">
                      <Trash2 size={16} />
                    </button>
                    <Link to={`/marketplace/configure?product=${p?.slug || fav.target_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div style={{ height: 140, background: p?.hero_image ? `url(${p.hero_image}) center/cover` : 'var(--bg-elevated)' }} />
                      <div style={{ padding: 14 }}>
                        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{p?.name || 'Product'}</h3>
                        {p?.base_price != null && <span style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>From ${p.base_price}</span>}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {otherFavs.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Other saved items</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {otherFavs.map(fav => (
                  <div key={fav.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{fav.target_type}: {fav.target_id}</span>
                    <button onClick={() => removeFavorite(fav.id)} className="btn btn-outline" style={{ padding: '6px 12px' }}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favorites.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <h3 className="heading-md">No favorites yet</h3>
              <p>Save products you like by clicking the heart icon.</p>
              <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: 16 }}><ShoppingBag size={16} style={{ marginRight: 8 }} /> Browse Products</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;

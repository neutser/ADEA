import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const products = [
  { title: 'Family Name Signs', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', link: '/shop/home-decor' },
  { title: 'Quote Plaques', img: 'https://images.unsplash.com/photo-1583847268964-b28e5451e5af?w=600&q=80', link: '/shop/home-decor' },
  { title: 'Layered Wall Art', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&q=80', link: '/shop/home-decor' },
  { title: 'Nursery Signs', img: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', link: '/shop/home-decor' },
  { title: 'Memorial Plaques', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80', link: '/shop/home-decor' },
];

const HomeDecor = () => (
  <>
    <PageMeta title="Home Decor" description="Family name signs, quote plaques, layered wall art, nursery signs, and memorial plaques." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <Home size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Home Decor</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Family name signs, quote plaques, layered wall art, nursery signs, and memorial plaques.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/crafts/configurator" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Design Your Piece
            </Link>
            <Link to="/shop/home-decor" className="btn btn-outline" style={{ padding: '16px 32px' }}>
              Browse Catalog
            </Link>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link to={p.link} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
                <div style={{ height: 220, background: `url(${p.img}) center/cover` }} />
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{p.title}</h3>
                  <ArrowRight size={20} color="var(--accent-neon-blue)" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default HomeDecor;

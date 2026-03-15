import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const products = [
  { title: 'Welcome Signs', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', link: '/shop/wedding' },
  { title: 'Table Numbers', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80', link: '/shop/wedding' },
  { title: 'Guest Name Tags', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Seating Charts', img: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', link: '/shop/wedding' },
  { title: 'Wedding Favors', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', link: '/crafts/configurator' },
];

const WeddingEvent = () => (
  <>
    <PageMeta title="Wedding & Event Signs" description="Custom welcome signs, table numbers, guest tags, seating charts, and wedding favors. Bulk CSV support." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <Heart size={48} color="var(--accent-neon-purple)" style={{ marginBottom: 24 }} />
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Wedding & Event</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Welcome signs, seating charts, table numbers, and personalized favors. Bulk customization with CSV upload.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/crafts/configurator" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Design Your Favors
            </Link>
            <Link to="/shop/wedding" className="btn btn-outline" style={{ padding: '16px 32px' }}>
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
                  <ArrowRight size={20} color="var(--accent-neon-purple)" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card glass-panel"
          style={{ marginTop: '60px', padding: '40px', textAlign: 'center' }}
        >
          <h3 className="heading-md" style={{ marginBottom: 16 }}>Bulk Guest Names</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Upload a CSV with guest names. We generate unique tags for each guest automatically.
          </p>
          <Link to="/crafts/configurator" className="btn btn-outline">Try Bulk Mode</Link>
        </motion.div>
      </div>
    </div>
  </>
);

export default WeddingEvent;

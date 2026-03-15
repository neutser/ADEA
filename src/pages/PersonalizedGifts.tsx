import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const products = [
  { title: 'Acrylic Keychains', img: 'https://images.unsplash.com/photo-1584883907797-17ed40590a36?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Wooden Keychains', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Engraved Pet Tags', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Custom Coasters', img: 'https://images.unsplash.com/photo-1614088829871-31644e590740?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Phone Stands', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Engraved Plaques', img: 'https://images.unsplash.com/photo-1583847268964-b28e5451e5af?w=600&q=80', link: '/crafts/configurator' },
];

const PersonalizedGifts = () => (
  <>
    <PageMeta title="Personalized Gifts" description="Custom keychains, coaster, pet tags, and engraved gifts. Fast customization and checkout." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <Gift size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Personalized Gifts</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Custom keychains, coasters, pet tags, and engraved gifts. Fast customization and instant checkout.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/crafts/configurator" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Design Your Gift
            </Link>
            <Link to="/shop/personalized-gifts" className="btn btn-outline" style={{ padding: '16px 32px' }}>
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

export default PersonalizedGifts;

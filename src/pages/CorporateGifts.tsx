import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const products = [
  { title: 'Metal Business Cards', img: 'https://images.unsplash.com/photo-1562016556-912b7d2bf6cd?w=600&q=80', link: '/shop/personalized-gifts' },
  { title: 'Engraved Leather', img: 'https://images.unsplash.com/photo-1481358509831-2fb0705a61d1?w=600&q=80', link: '/shop/personalized-gifts' },
  { title: 'Logo Stamps & Plaques', img: 'https://images.unsplash.com/photo-1579762593175-20226054cad0?w=600&q=80', link: '/shop/personalized-gifts' },
  { title: 'Desk Nameplates', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', link: '/signs/office' },
];

const CorporateGifts = () => (
  <>
    <PageMeta title="Corporate Gifts" description="Branded merchandise: metal business cards, engraved leather, logo stamps, desk nameplates." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <Briefcase size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Corporate Gifts</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Branded merchandise: metal business cards, engraved leather, logo stamps, and desk nameplates.
          </p>
          <Link to="/quote" className="btn btn-primary" style={{ marginTop: '32px', padding: '16px 32px' }}>
            Request Bulk Quote
          </Link>
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

export default CorporateGifts;

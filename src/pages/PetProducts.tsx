import { Link } from 'react-router-dom';
import { ArrowRight, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const products = [
  { title: 'Engraved Pet Tags', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Pet Name Plaques', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Dog House Signs', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80', link: '/crafts/configurator' },
  { title: 'Pet Memorial Plaques', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80', link: '/crafts/configurator' },
];

const PetProducts = () => (
  <>
    <PageMeta title="Pet Products" description="Engraved pet tags, pet name plaques, dog house signs, and pet memorial plaques." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <PawPrint size={48} color="#ff9900" style={{ marginBottom: 24 }} />
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Pet Products</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Engraved pet tags, pet name plaques, dog house signs, and pet memorial plaques.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/crafts/configurator" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Design Pet Tag
            </Link>
            <Link to="/shop/pet-products" className="btn btn-outline" style={{ padding: '16px 32px' }}>
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
                  <ArrowRight size={20} color="#ff9900" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default PetProducts;

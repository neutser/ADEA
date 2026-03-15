import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Lightbulb, DoorOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { businessSignsSubPages } from '@/data/businessSignsSubPages';

const BusinessSigns = () => (
  <>
    <PageMeta title="Business Signage" description="Professional 3D logo signs, LED acrylic signs, office signage, and custom branding for businesses." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Business Signage</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Premium custom signage for offices, restaurants, salons, and retail. See your sign before you buy.
          </p>
          <Link to="/ai-builder" className="btn btn-primary" style={{ marginTop: '32px', padding: '16px 32px' }}>
            Upload Your Building Photo
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {businessSignsSubPages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link to={`/signs/${p.id}`} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
                <div style={{ height: 200, background: `url(${p.img}) center/cover` }} />
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="heading-md" style={{ fontSize: '1.2rem', marginBottom: 4 }}>{p.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.priceRange}</p>
                  </div>
                  <ArrowRight size={20} color="var(--accent-neon-blue)" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <Building2 size={40} color="var(--accent-neon-blue)" style={{ marginBottom: 16 }} />
            <h3 className="heading-md" style={{ marginBottom: 12 }}>B2B Quote Requests</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Large projects and custom quotes. Contact us for pricing on bulk orders.</p>
            <Link to="/quote" className="btn btn-outline" style={{ marginTop: 16 }}>Request Quote</Link>
          </div>
          <div className="card" style={{ padding: '32px' }}>
            <Lightbulb size={40} color="var(--accent-neon-purple)" style={{ marginBottom: 16 }} />
            <h3 className="heading-md" style={{ marginBottom: 12 }}>LED Illumination</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Warm white, neon blue, or purple halo. Make your sign stand out.</p>
            <Link to="/marketplace/configure?product=sign-3d-logo" className="btn btn-outline" style={{ marginTop: 16 }}>Configure</Link>
          </div>
          <div className="card" style={{ padding: '32px' }}>
            <DoorOpen size={40} color="#ff9900" style={{ marginBottom: 16 }} />
            <h3 className="heading-md" style={{ marginBottom: 12 }}>Preview in Your Space</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Upload a photo of your space. See your sign in place before purchase.</p>
            <Link to="/ai-builder" className="btn btn-outline" style={{ marginTop: 16 }}>AI Builder</Link>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default BusinessSigns;

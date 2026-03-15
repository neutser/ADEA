import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Wrench, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { businessSignsSubPages } from '@/data/businessSignsSubPages';

const BusinessSignSubPage = () => {
  const { subType } = useParams<{ subType: string }>();
  const page = businessSignsSubPages.find((p) => p.id === subType);

  if (!page) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="heading-lg">Page not found</h1>
          <Link to="/signs" className="btn btn-outline" style={{ marginTop: 16 }}>
            <ArrowLeft size={18} style={{ marginRight: 8 }} /> Back to Business Signs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={page.title} description={page.desc} />
      <div className="section">
        <div className="container" style={{ maxWidth: 1000 }}>
          <Link to="/signs" style={{ color: 'var(--accent-neon-blue)', marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={18} /> Back to Business Signs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
              <div style={{ height: 320, background: `url(${page.img}) center/cover` }} />
              <div style={{ padding: 32 }}>
                <h1 className="heading-lg" style={{ marginBottom: 16 }}>{page.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 24 }}>{page.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  <Link to="/marketplace/configure?product=craft-sign" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Design Your Sign
                  </Link>
                  <Link to="/marketplace/configure?product=craft-sign" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Customize Design
                  </Link>
                  <Link to="/quote" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Request Quote
                  </Link>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div className="card glass-panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <Wrench size={24} color="var(--accent-neon-blue)" />
                  <h3 className="heading-md" style={{ margin: 0, fontSize: '1.1rem' }}>Material Options</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {page.materials.map((m, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < page.materials.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <span>{m.name}</span>
                      <span style={{ color: 'var(--accent-neon-blue)', fontWeight: 600 }}>{m.priceRange}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card glass-panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <DollarSign size={24} color="var(--accent-neon-purple)" />
                  <h3 className="heading-md" style={{ margin: 0, fontSize: '1.1rem' }}>Price Range</h3>
                </div>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-neon-blue)', marginBottom: 16 }}>{page.priceRange}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Final price depends on size, material, and quantity. Request a quote for exact pricing.</p>
              </div>

              <div className="card glass-panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <CheckCircle size={24} color="#00ff88" />
                  <h3 className="heading-md" style={{ margin: 0, fontSize: '1.1rem' }}>Ideal For</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {page.examples.map((ex, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                      <CheckCircle size={14} color="#00ff88" /> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card glass-panel" style={{ marginTop: 32, padding: 32, textAlign: 'center', border: '1px solid var(--accent-neon-blue)' }}>
              <h3 className="heading-md" style={{ marginBottom: 12 }}>Ready to Get Started?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Upload your logo, preview in your space, and order or request a quote.</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/design-wizard" className="btn btn-primary">Start Designing</Link>
                <Link to="/quote" className="btn btn-outline">Request Quote</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BusinessSignSubPage;

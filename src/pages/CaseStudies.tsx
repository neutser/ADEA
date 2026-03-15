import { Link } from 'react-router-dom';
import { AlertCircle, Image, CheckCircle2, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const studies = [
  {
    id: 1,
    title: 'Elevate Salon – LED Reception Sign',
    client: 'Salon & Barbershop',
    problem: 'The reception area felt generic. Clients couldn\'t connect the space to the brand. The owner wanted a striking focal point that would be Instagram-worthy.',
    designPreview: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80',
    finalResult: 'https://images.unsplash.com/photo-1521484342378-0027f6ce72a8?w=600&q=80',
    materials: 'LED Backlit Acrylic (5mm white), Cool White LED strip, Matte Black mounting',
    result: '40% increase in brand recognition. Clients now photograph the sign and tag the salon.',
  },
  {
    id: 2,
    title: 'TechFlow Inc. – 3D Office Logo',
    client: 'Corporate Office',
    problem: 'The new office reception had a blank wall. The CEO wanted a premium, modern statement that would impress investors and new hires without feeling flashy.',
    designPreview: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80',
    finalResult: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    materials: 'Layered 3D Acrylic (8mm clear + 3mm black), Neon Blue accent layer',
    result: 'Premium first impression. Consistently mentioned in office tours and client feedback.',
  },
  {
    id: 3,
    title: 'The Rustic Grill – Outdoor Signage',
    client: 'Restaurant',
    problem: 'The old painted wooden sign was fading and hard to read at night. The restaurant needed durable, visible signage that matched their rustic-modern aesthetic.',
    designPreview: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=600&q=80',
    finalResult: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    materials: 'Natural Oak (6mm), Solid White Acrylic lettering, Weather-resistant finish',
    result: 'Visible from the street day and night. No maintenance required in 18 months.',
  },
  {
    id: 4,
    title: 'Wedding Venue – Custom Seating Chart',
    client: 'Wedding & Events',
    problem: 'The venue wanted a reusable, elegant seating chart that could be customized for each wedding. Paper charts were flimsy and looked cheap.',
    designPreview: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
    finalResult: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    materials: 'Frosted Acrylic (3mm), Laser engraved names, Gold stand',
    result: 'Reusable template. Brides love the premium look. Venue now offers it as an add-on.',
  },
];

const CaseStudies = () => (
  <>
    <PageMeta title="Case Studies" description="See how businesses use Adea Crafts for custom signage and branding. Client problems, design previews, and final results." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Case Studies</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Real projects: client problems, design previews, final results, and materials used.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {studies.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card glass-panel"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ padding: '32px 32px 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>{s.client}</span>
                <h2 className="heading-md" style={{ fontSize: '1.5rem', margin: '8px 0 24px' }}>{s.title}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <AlertCircle size={18} color="#ff9900" />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Client Problem</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.problem}</p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Layers size={18} color="var(--accent-neon-blue)" />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Materials Used</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.materials}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Image size={14} /> Design Preview
                  </div>
                  <img src={s.designPreview} alt="Design preview" style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent-neon-blue)', color: '#000', padding: '4px 12px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, zIndex: 1 }}>
                    <CheckCircle2 size={14} /> Final Result
                  </div>
                  <img src={s.finalResult} alt="Final result" style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                </div>
              </div>

              <div style={{ padding: '24px 32px 32px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CheckCircle2 size={18} color="#00ff88" />
                  <span style={{ fontWeight: 600 }}>Result</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>{s.result}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/portfolio" className="btn btn-outline">View Full Portfolio</Link>
        </div>
      </div>
    </div>
  </>
);

export default CaseStudies;

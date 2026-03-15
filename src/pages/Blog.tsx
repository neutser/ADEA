import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';

const posts = [
  { id: 1, title: 'How to Choose the Right Sign Material', date: 'Mar 2025', excerpt: 'Acrylic vs wood vs metal – which is best for your business?', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80' },
  { id: 2, title: 'LED Signs: Warm White vs Neon', date: 'Feb 2025', excerpt: 'Lighting options for your custom logo sign.', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&q=80' },
  { id: 3, title: 'Wedding Favors: Bulk Personalization', date: 'Jan 2025', excerpt: 'CSV upload and bulk engraving for wedding guests.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80' },
];

const Blog = () => (
  <>
    <PageMeta title="Blog" description="Tips, guides, and inspiration for custom signage and personalized products." />
    <div className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Blog</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Tips, guides, and inspiration for custom signage and personalized products.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card glass-panel"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: 200, background: `url(${p.img}) center/cover` }} />
              <div style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</span>
                <h3 className="heading-md" style={{ fontSize: '1.2rem', margin: '8px 0' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 16 }}>{p.excerpt}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-neon-blue)', fontWeight: 600 }}>
                  Read more <ArrowRight size={16} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default Blog;

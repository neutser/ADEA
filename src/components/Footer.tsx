import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer section" style={{ paddingBottom: '40px', paddingTop: '80px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <motion.span whileHover={{ scale: 1.05 }}>
                <Layers size={28} color="var(--accent-neon-blue)" />
              </motion.span>
              <span className="heading-md" style={{ fontSize: '1.5rem', margin: 0 }}>Adea Crafts</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)' }}>
              Premium custom 3D logo signs and laser-engraved products for modern businesses and individuals.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h4 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Products</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['/shop/crafts', '/shop/gifts', '/shop/signs', '/shop/stationery'].map((to, i) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                    <motion.span style={{ display: 'inline-block' }} whileHover={{ x: 4, color: 'var(--accent-neon-blue)' }}>{['Crafts', 'Gifts', 'Signs', 'Stationery'][i]}</motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            <h4 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/marketplace/configure?product=craft-sign&mode=scene', label: 'AI Builder' },
                { to: '/portfolio', label: 'Portfolio' },
                { to: '/case-studies', label: 'Case Studies' },
                { to: '/blog', label: 'Blog' },
                { to: '/solutions', label: 'Business Solutions' },
                { to: '/login', label: 'Admin Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                    <motion.span style={{ display: 'inline-block' }} whileHover={{ x: 4, color: 'var(--accent-neon-blue)' }}>{label}</motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h4 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> support@adeacrafts.com</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} /> 100% Satisfaction Guarantee</li>
            </ul>
          </motion.div>
          
        </div>
        
        <motion.div
          style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>&copy; {new Date().getFullYear()} Adea Crafts. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { to: '/contact', label: 'Contact' },
              { to: '/quote', label: 'Get a Quote' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ color: 'inherit' }}>
                <motion.span style={{ display: 'inline-block' }} whileHover={{ color: 'var(--accent-neon-blue)' }}>{label}</motion.span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

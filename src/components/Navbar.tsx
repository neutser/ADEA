import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { navLinks } from '@/data/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.nav
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={32} color="var(--accent-neon-blue)" className="neon-text-blue" />
          <span className="heading-md" style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '1px' }}>
            ADEA CRAFTS
          </span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-menu">
          {navLinks.map(({ to, label, highlight }) => (
            <Link key={to} to={to} className="text-sm" style={{ fontWeight: 500, color: highlight ? 'var(--accent-neon-blue)' : 'var(--text-secondary)' }}>
              <motion.span
                style={{ display: 'inline-block' }}
                whileHover={{ y: -1, color: 'var(--accent-neon-blue)' }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
          <Link to="/quote" className="btn btn-primary" style={{ padding: '8px 20px' }}>
            Get a Quote
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link
            to="/cart"
            style={{ color: 'var(--text-primary)', position: 'relative' }}
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="cart-badge"
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: 'var(--accent-neon-blue)',
                  color: 'var(--bg-color)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </Link>
          <Link to="/login" style={{ color: 'var(--text-primary)' }} aria-label="Account / Admin">
            <User size={24} />
          </Link>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              className="mobile-menu-overlay open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              className="mobile-menu-drawer open"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm"
                  style={{ fontWeight: 500, color: 'var(--text-primary)', padding: '12px 0' }}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/quote"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={closeMenu}
              >
                Get a Quote
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

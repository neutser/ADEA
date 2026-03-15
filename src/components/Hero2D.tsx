/**
 * 2D Hero Section (3D disabled)
 * - Gradient background, animated headline
 * - Interactive name engraving input
 * - CTA buttons
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Hero2DProps {
  onEngraveName?: (name: string) => void;
}

export function Hero2D({ onEngraveName }: Hero2DProps) {
  const [engraveName, setEngraveName] = useState('');

  const handleNameChange = (value: string) => {
    setEngraveName(value);
    onEngraveName?.(value);
  };

  return (
    <section
      className="hero-2d"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050508 0%, #0a0a12 40%, #080810 70%, #050508 100%)',
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0,240,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '80px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 24 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 50%, #00f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Create Anything.
            <br />
            Customize Everything.
          </h1>
        </motion.div>

        <motion.p
          style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', fontSize: '1.1rem', lineHeight: 1.6 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          AI-powered design studio. Real-time 2D preview. Craft your perfect product.
        </motion.p>

        {/* Interactive Name Engraving */}
        <motion.div
          style={{ marginBottom: 40 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Type your name..."
            maxLength={20}
            onChange={(e) => handleNameChange(e.target.value)}
            className="hero-name-input"
            style={{
              width: 'min(320px, 90vw)',
              padding: '16px 24px',
              fontSize: '1.2rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 12,
              color: '#fff',
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 24px rgba(0,240,255,0.2)';
              e.target.style.borderColor = 'var(--accent-neon-blue)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'rgba(0,240,255,0.3)';
            }}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 12 }}>
            See it engraved on a pen, keychain, or coaster
          </p>
          {engraveName.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginTop: 20,
                padding: '16px 24px',
                background: 'linear-gradient(145deg, #1a1a1e 0%, #0f0f12 100%)',
                border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: 12,
                display: 'inline-block',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px rgba(0,0,0,0.3)',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, display: 'block' }}>
                Engraving preview
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--accent-neon-blue)',
                  letterSpacing: '0.05em',
                }}
              >
                {engraveName}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            to="/marketplace/configure?product=craft-keychain"
            className="btn btn-primary"
            style={{ padding: '16px 32px', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '1rem' }}
          >
            <Sparkles size={20} /> Start Crafting
          </Link>
          <Link
            to="/marketplace"
            className="btn btn-outline"
            style={{ padding: '16px 32px', fontSize: '1rem' }}
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

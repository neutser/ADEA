import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const signTypes = [
  { id: 'led', name: 'LED Sign', preview: 'rgba(0,240,255,0.2)', border: 'var(--accent-neon-blue)' },
  { id: 'acrylic', name: 'Acrylic', preview: 'rgba(255,255,255,0.15)', border: '#fff' },
  { id: 'wood', name: 'Wood', preview: 'rgba(139,90,43,0.3)', border: '#8b5a2b' },
];

/**
 * Interactive AI Demo – compact configurator for homepage engagement
 * Upload logo, select sign type, see instant preview
 */
const HomeMiniConfigurator: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [signType, setSignType] = useState(signTypes[0]);
  const [text, setText] = useState('YOUR LOGO');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="card glass-panel"
      style={{
        padding: '32px',
        maxWidth: '900px',
        margin: '0 auto',
        border: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Sparkles size={24} color="var(--accent-neon-blue)" />
        <h3 className="heading-md" style={{ fontSize: '1.25rem', margin: 0 }}>Try It Now – See Your Sign Instantly</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', alignItems: 'center' }}>
        {/* Preview area */}
        <div
          style={{
            aspectRatio: '16/9',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(20,20,30,0.9), rgba(10,10,20,0.95))',
            border: `2px solid ${signType.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              width: '70%',
              height: '50%',
              background: signType.preview,
              borderRadius: '8px',
              border: `2px solid ${signType.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: signType.id === 'led' ? `0 0 30px rgba(0,240,255,0.3)` : 'none',
            }}
            layout
            transition={{ duration: 0.3 }}
          >
            {logo ? (
              <motion.img src={logo} alt="Your logo" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} />
            ) : (
              <span style={{ color: signType.border, fontWeight: 700, fontSize: '1.5rem', letterSpacing: 2 }}>{text}</span>
            )}
          </motion.div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Upload logo or enter text</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }}
              aria-label="Upload logo"
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} /> Upload
              </button>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Or type text"
                className="input"
                style={{ flex: 1 }}
                aria-label="Sign text"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Sign type</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {signTypes.map((t) => (
                <motion.button
                  key={t.id}
                  type="button"
                  onClick={() => setSignType(t)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${signType.id === t.id ? t.border : 'var(--border-color)'}`,
                    background: signType.id === t.id ? `${t.preview}` : 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: signType.id === t.id ? 600 : 400,
                  }}
                >
                  {t.name}
                </motion.button>
              ))}
            </div>
          </div>

          <Link to="/ai-builder" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={18} /> Full AI Builder – Preview in Your Space
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeMiniConfigurator;

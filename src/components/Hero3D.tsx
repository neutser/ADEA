/**
 * 3D Animated Hero Section
 * - Dark minimal background with soft gradients
 * - Falling/floating 3D product objects (pens, mugs, keychains, etc.)
 * - Laser engraving animation for title
 * - Interactive name engraving preview
 * - CTA buttons with glow effects
 */

import { useMemo, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Building2 } from 'lucide-react';

const FALLING_OBJECTS = [
  { type: 'mug', scale: 0.4, x: -6, y: 2, z: -2 },
  { type: 'keychain', scale: 0.35, x: 5, y: -1, z: -3 },
  { type: 'pen', scale: 0.3, x: -4, y: -2, z: -1 },
  { type: 'cap', scale: 0.45, x: 6, y: 1, z: -4 },
  { type: 'phone', scale: 0.35, x: -7, y: 0, z: -5 },
  { type: 'medal', scale: 0.3, x: 4, y: -3, z: -2 },
  { type: 'shirt', scale: 0.4, x: 7, y: 2, z: -3 },
  { type: 'mug2', scale: 0.32, x: -5, y: -1, z: -4 },
  { type: 'keychain2', scale: 0.28, x: 3, y: 1, z: -1 },
];

function ProductMesh({ type, scale }: { type: string; scale: number }) {
  const seed = useMemo(() => Math.random() * 100, []);

  const color = useMemo(() => {
    const colors = ['#2a2a2a', '#1a2744', '#1a1a2e', '#252530', '#1e2a3a'];
    return colors[Math.floor(seed % colors.length)];
  }, [seed]);

  const metalness = 0.4 + (seed % 10) * 0.05;
  const roughness = 0.6 + (seed % 10) * 0.03;

  if (type === 'mug' || type === 'mug2') {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 1.2, 24]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} envMapIntensity={0.5} />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <torusGeometry args={[0.35, 0.08, 12, 32, Math.PI]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
      </group>
    );
  }
  if (type === 'keychain' || type === 'keychain2') {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 1.5, 0.15]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.04, 8, 24]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    );
  }
  if (type === 'pen') {
    return (
      <group scale={scale} rotation={[0, 0, Math.PI / 6]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.2, 16]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <coneGeometry args={[0.12, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  }
  if (type === 'cap') {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.4]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.3, 0.5]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.85} />
        </mesh>
      </group>
    );
  }
  if (type === 'phone') {
    return (
      <group scale={scale} rotation={[0.3, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.2, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
    );
  }
  if (type === 'medal') {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
          <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }
  if (type === 'shirt') {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.4, 0.4]} />
          <meshStandardMaterial color={color} metalness={0} roughness={0.9} />
        </mesh>
      </group>
    );
  }
  return null;
}

function FallingObjects() {
  return (
    <>
      {FALLING_OBJECTS.map((obj, i) => (
        <Float key={i} speed={1.2 + i * 0.1} rotationIntensity={0.15} floatIntensity={0.35}>
          <group position={[obj.x, obj.y, obj.z]}>
            <ProductMesh type={obj.type} scale={obj.scale} />
          </group>
        </Float>
      ))}
    </>
  );
}

function Hero3DScene() {
  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 15, 35]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={0.4} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.2} color="#1a2744" />
      <pointLight position={[5, 5, 10]} intensity={0.15} color="#0a1628" />
      <Environment preset="night" environmentIntensity={0.2} />
      <Suspense fallback={null}>
        <FallingObjects />
        <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={30} blur={2} far={10} />
      </Suspense>
    </>
  );
}

interface Hero3DProps {
  onEngraveName?: (name: string) => void;
}

export function Hero3D({ onEngraveName }: Hero3DProps) {
  const [engraveName, setEngraveName] = useState('');

  const handleNameChange = (value: string) => {
    setEngraveName(value);
    onEngraveName?.(value);
  };

  return (
    <section
      className="hero-3d"
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
      {/* 3D Canvas Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas shadows camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: false, antialias: true }}>
          <Hero3DScene />
        </Canvas>
      </div>

      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0,240,255,0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '80px 24px' }}>
        {/* Engraving Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 24, position: 'relative' }}
        >
          <h1
            className="engraving-title"
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
              position: 'relative',
            }}
          >
            <span className="engraving-line" style={{ animation: 'engraveLine 2.5s ease-out forwards' }}>
              Create Anything.
            </span>
            <br />
            <span className="engraving-line" style={{ animation: 'engraveLine 2.5s ease-out 0.4s forwards' }}>
              Customize Everything.
            </span>
          </h1>
          {/* Laser line effect - subtle engraving trace */}
          <div
            className="engraving-laser"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 2,
              height: '100%',
              background: 'linear-gradient(180deg, transparent, var(--accent-neon-blue), transparent)',
              opacity: 0,
              transform: 'translateX(-50%)',
              animation: 'laserTrace 3s ease-in-out 0.5s forwards',
              boxShadow: '0 0 20px var(--accent-neon-blue)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        <motion.p
          style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', fontSize: '1.1rem', lineHeight: 1.6 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          AI-powered design studio. Photorealistic 3D preview. Real-time customization.
        </motion.p>

        {/* Interactive Name Engraving */}
        <motion.div
          style={{ marginBottom: 40 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
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
            See it engraved on a pen, keychain, or mug
          </p>
          {engraveName.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="engrave-preview"
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
                className="engrave-text"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'transparent',
                  background: 'linear-gradient(180deg, #c9a227 0%, #8b6914 50%, #5c4510 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  animation: 'engraveReveal 0.8s ease-out forwards',
                }}
              >
                {engraveName}
              </span>
              <Link
                to={`/marketplace/configure?product=keychain-custom&text=${encodeURIComponent(engraveName)}`}
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  fontSize: '0.9rem',
                  color: 'var(--accent-neon-blue)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                See on keychain →
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <Link
            to="/design"
            className="btn-hero-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 36px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-neon-blue), #00c4cc)',
              color: '#050508',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,240,255,0.35), 0 0 40px rgba(0,240,255,0.15)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Sparkles size={22} strokeWidth={2.5} />
            Start Designing
          </Link>
          <Link
            to="/marketplace/configure?product=craft-sign&mode=scene"
            className="btn-hero-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 36px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,240,255,0.35)',
              color: 'var(--accent-neon-blue)',
              textDecoration: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Building2 size={20} /> Upload Your Building Photo
          </Link>
          <Link
            to="/shop"
            className="btn-hero-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 36px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              textDecoration: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            Explore Products
          </Link>
        </motion.div>
      </div>

      {/* CSS for engraving and button hover */}
      <style>{`
        @keyframes engraveLine {
          0% { clip-path: inset(0 100% 0 0); opacity: 0.8; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        @keyframes engraveReveal {
          0% { opacity: 0; filter: brightness(0.3); }
          100% { opacity: 1; filter: brightness(1); }
        }
        @keyframes laserTrace {
          0% { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateX(-50%) translateY(100%); opacity: 0; }
        }
        .btn-hero-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 32px rgba(0,240,255,0.45), 0 0 60px rgba(0,240,255,0.25);
        }
        .btn-hero-secondary:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.1);
          border-color: rgba(0,240,255,0.4);
          box-shadow: 0 0 30px rgba(0,240,255,0.1);
        }
      `}</style>
    </section>
  );
}

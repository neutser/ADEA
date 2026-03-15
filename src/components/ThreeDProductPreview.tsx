import { useRef, Suspense, useMemo, useState, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, Center, Float, ContactShadows, SoftShadows, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface Props {
  config: any;
  productType?: string;
  materialFinish?: string;
  isNightMode?: boolean;
}

/** Renders sign face when logo/artwork image is provided */
function SignModelWithLogo({ config, materialFinish }: any) {
  const logoUrl = config?.logo || config?.artwork || config?.photo;
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const texRef = useRef<THREE.Texture | null>(null);
  useEffect(() => {
    if (!logoUrl || !logoUrl.startsWith('data:')) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      texRef.current = tex;
      setTexture(tex);
    };
    img.src = logoUrl;
    return () => {
      texRef.current?.dispose();
      texRef.current = null;
      setTexture(null);
    };
  }, [logoUrl]);

  const materialProps = useMemo(() => {
    const mat = config?.material || materialFinish;
    switch (mat) {
      case 'acrylic_black':
      case 'matte_black':
        return { color: '#1a1a1a', metalness: 0.3, roughness: 0.8 };
      case 'acrylic_white':
      case 'white':
        return { color: '#f8f8f8', metalness: 0.1, roughness: 0.5 };
      default:
        return { color: '#ffffff', metalness: 0.1, roughness: 0.2 };
    }
  }, [config, materialFinish]);

  if (!texture) return null;
  const size = 4;
  return (
    <group>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[size, size * 0.6]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <Decal position={[0, 0, 0.05]} rotation={[0, 0, 0]} scale={[size * 0.9, size * 0.54, 1]} map={texture} />
    </group>
  );
}

function SignModel({ config, materialFinish, isNightMode }: any) {
  const textGroupRef = useRef<THREE.Group>(null);
  const logoUrl = config?.logo || config?.artwork || config?.photo;
  const hasLogo = logoUrl && (typeof logoUrl === 'string' && logoUrl.startsWith('data:'));

  // When logo is present, use logo-based sign
  if (hasLogo) {
    return (
      <group>
        <SignModelWithLogo config={config} materialFinish={materialFinish} />
        {config?.led && (
          <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[5, 4]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        )}
      </group>
    );
  }

  // Base materials
  const materialProps = useMemo(() => {
    // Determine material from the main config object rather than arbitrary overrides whenever possible
    const mat = config?.material || materialFinish;
    switch (mat) {
      case 'gold_mirror':
      case 'mirror_gold':
        return { color: '#d4af37', metalness: 1, roughness: 0.05, envMapIntensity: 2.5 };
      case 'silver_mirror':
      case 'mirror_silver':
        return { color: '#e0e0e0', metalness: 1, roughness: 0.05, envMapIntensity: 2.5 };
      case 'clear_acrylic':
      case 'acrylic_clear':
        return { color: '#ffffff', transmission: 0.95, opacity: 1, metalness: 0, roughness: 0.05, ior: 1.5, thickness: 0.5 };
      case 'acrylic_black':
      case 'matte_black':
        return { color: '#1a1a1a', metalness: 0.3, roughness: 0.8 };
      case 'wood_oak':
      case 'wood':
        return { color: '#c4a574', metalness: 0, roughness: 0.9 };
      case 'wood_walnut':
        return { color: '#5c4033', metalness: 0, roughness: 0.9 };
      case 'acrylic_white':
      case 'white':
        return { color: '#f8f8f8', metalness: 0.1, roughness: 0.5 };
      default:
        return { color: '#ffffff', metalness: 0.1, roughness: 0.2 };
    }
  }, [config, materialFinish]);

  // Handle dynamic text, width tracking, and LED logic
  const textRaw = config?.text || config?.couple_names || 'ADEA';
  const displayLines = textRaw.length > 15 ? textRaw.match(/.{1,15}(\s+|$)/g) || [textRaw] : [textRaw];
  const maxLineLength = Math.max(...displayLines.map((l: string) => l.length));
  
  // LED glow color map
  const ledColorMap: Record<string, string> = {
    warm_white: '#ffeedd',
    cool_white: '#f4faff',
    red: '#ff2a2a',
    blue: '#00f0ff',
    green: '#2aff2a',
    pink: '#ff2add',
    purple: '#b026ff',
    yellow: '#ffea00',
  };
  
  const hasLed = config?.led !== undefined ? config.led : (config?.type === 'sign' || config?.led_color);
  const selectedLedColor = config?.led_color ? (ledColorMap[config.led_color] || config.led_color) : '#00f0ff';
  const ledIntensity = isNightMode ? 0.9 : 0.3;

  return (
    <group ref={textGroupRef}>
      <Center>
        <group>
          {displayLines.map((line: string, idx: number) => (
            <Text3D
              key={idx}
              font="/fonts/Inter_Bold.json"
              size={2}
              height={config?.thickness ? parseFloat(config.thickness) / 10 : 0.4}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              position={[0, -idx * 2.5, 0]}
            >
              {line.trim()}
              {(config?.material === 'clear_acrylic' || materialFinish === 'clear_acrylic') ? (
                <meshPhysicalMaterial {...materialProps} />
              ) : (
                <meshStandardMaterial {...materialProps} />
              )}
            </Text3D>
          ))}
        </group>
      </Center>

      {/* LED Halo Simulation */}
      {hasLed && (
        <mesh position={[0, -((displayLines.length - 1) * 1.25), -0.3]}>
          <planeGeometry args={[(maxLineLength * 1.6) + 3, (displayLines.length * 2.5) + 2]} />
          <meshBasicMaterial 
            color={selectedLedColor} 
            transparent 
            opacity={ledIntensity} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Backplate / Mounting */}
      <mesh position={[0, -((displayLines.length - 1) * 1.25), -0.4]} receiveShadow castShadow>
        <boxGeometry args={[(maxLineLength * 1.6) + 2, (displayLines.length * 2.5) + 1.5, 0.15]} />
        <meshStandardMaterial color={config?.backplate === 'clear' ? '#eee' : '#111'} roughness={0.3} metalness={0.1} transparent={config?.backplate === 'clear'} opacity={config?.backplate === 'clear' ? 0.3 : 1} />
      </mesh>

      {/* Mounting Standoffs (The "Real" Hardware) */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, y], i) => (
        <mesh key={i} position={[x * (maxLineLength * 0.7), -((displayLines.length - 1) * 1.25) + (y * displayLines.length * 1), -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}
function TShirtModel({ config }: any) {
  const shirtColor = config?.garment_color === 'black' ? '#0a0a0a' : (config?.garment_color || '#1e293b');
  const text = config?.text || config?.logo_text || '';
  
  return (
    <group>
      {/* Torso - Rounded for realism */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 4, 32]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      {/* Shoulders */}
      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      {/* Sleeves - Angled and rounded */}
      <group position={[-1.6, 1.5, 0]} rotation={[0, 0, 0.5]}>
        <mesh castShadow receiveShadow position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6, 0.7, 1.8, 32]} />
          <meshStandardMaterial color={shirtColor} roughness={0.9} />
        </mesh>
      </group>
      <group position={[1.6, 1.5, 0]} rotation={[0, 0, -0.5]}>
        <mesh castShadow receiveShadow position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6, 0.7, 1.8, 32]} />
          <meshStandardMaterial color={shirtColor} roughness={0.9} />
        </mesh>
      </group>
      
      {/* Real-time Text Placement with curve adjustment */}
      {text && (
        <Center position={[0, 0.8, 1.5]} rotation={[0.1, 0, 0]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.25}
            height={0.02}
            curveSegments={12}
          >
            {text.slice(0, 20)}
            <meshStandardMaterial color="#fff" roughness={0.5} />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function PhoneCaseModel({ config }: any) {
  const caseColor = config?.case_color || '#111';
  const text = config?.text || '';
  
  return (
    <group rotation={[0.4, 0, 0]}>
      {/* Case Body - Rounded slim box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 5, 0.4]} />
        <meshStandardMaterial color={caseColor} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Camera Cutout */}
      <mesh position={[0.7, 1.8, 0.22]}>
        <boxGeometry args={[0.7, 1, 0.05]} />
        <meshStandardMaterial color="#000" roughness={0} metalness={1} />
      </mesh>
      {/* Artwork/Text */}
      {text && (
        <Center position={[0, -0.5, 0.21]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.2} height={0.01}>
            {text}
            <meshStandardMaterial color="#fff" />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function CapModel({ config }: any) {
  const capColor = config?.cap_color || '#2c3e50';
  const text = config?.text || '';
  
  return (
    <group position={[0, -0.5, 0]}>
      {/* Crown */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial color={capColor} roughness={0.9} />
      </mesh>
      {/* Visor/Brim */}
      <mesh castShadow receiveShadow position={[0, -0.4, 1.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[2.8, 0.05, 1.8]} />
        <meshStandardMaterial color={capColor} roughness={0.9} />
      </mesh>
      {/* Text Embroidery */}
      {text && (
        <Center position={[0, 0.5, 1.3]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.2} height={0.05}>
            {text}
            <meshStandardMaterial color="#fff" roughness={1} />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function BottleModel({ config }: any) {
  const bottleColor = config?.bottle_color || '#e0e0e0';
  const text = config?.text || '';
  
  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 5, 32]} />
        <meshStandardMaterial color={bottleColor} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh castShadow position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.4, 1, 0.8, 32]} />
        <meshStandardMaterial color={bottleColor} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Cap */}
      <mesh castShadow position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      {/* Laser Engraving */}
      {text && (
        <Center position={[0, 0, 1.01]} rotation={[0, 0, 0]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.25} height={0.02}>
            {text}
            <meshStandardMaterial color="#444" roughness={0.8} />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function PillowModel({ config }: any) {
  const pillowColor = config?.color || '#fff';
  const text = config?.text || '';
  
  return (
    <group rotation={[0.2, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 4, 1.5]} />
        <meshStandardMaterial color={pillowColor} roughness={1} />
      </mesh>
      {/* Buttons/Puffiness - simulated with scales or details */}
      <mesh position={[0,0,0.7]} scale={[1,1,0.2]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial color={pillowColor} roughness={1} />
      </mesh>
      {/* Print */}
      {text && (
        <Center position={[0, 0, 0.85]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.3} height={0.01}>
            {text}
            <meshStandardMaterial color="#333" roughness={1} />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function CandleModel({ config }: any) {
  const waxColor = config?.wax_color || '#fffce8';
  const text = config?.text || '';
  
  return (
    <group>
      {/* Jar/Wax */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 3, 32]} />
        <meshPhysicalMaterial color={waxColor} transmission={0.2} roughness={0.3} thickness={0.5} />
      </mesh>
      {/* Label Area */}
      <mesh position={[0, 0, 1.51]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>
      {/* Engraved Text */}
      {text && (
        <Center position={[0, 0, 1.52]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.15} height={0.01}>
            {text}
            <meshStandardMaterial color="#5c4033" />
          </Text3D>
        </Center>
      )}
      {/* Wick */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

function CuttingBoardModel({ config }: any) {
  const woodColor = config?.material === 'walnut' ? '#4b3621' : '#c4a574';
  const text = config?.text || 'Handcrafted';
  
  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
      {/* Main Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 4, 0.3]} />
        <meshStandardMaterial color={woodColor} roughness={0.8} metalness={0} />
      </mesh>
      {/* Handle Hole */}
      <mesh position={[2.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Engraving */}
      <Center position={[0, 0, 0.16]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.4}
          height={0.01}
        >
          {text}
          <meshStandardMaterial color="#1a1a1a" roughness={1} />
        </Text3D>
      </Center>
    </group>
  );
}

function MugModel({ config }: any) {
  const insideColor = config?.inside_color || '#fff';
  const handleColor = config?.handle_color || '#fff';
  const text = config?.text || 'Mug';
  
  return (
    <group rotation={[0.1, 0, 0]}>
      {/* Mug Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 3.5, 64, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          side={THREE.DoubleSide} 
          roughness={0.05} 
          metalness={0.2} 
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh receiveShadow position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.2, 16, 64, Math.PI]} />
        <meshPhysicalMaterial color={handleColor} roughness={0.05} clearcoat={1} />
      </mesh>
      {/* Inside */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 3.4, 64]} />
        <meshStandardMaterial color={insideColor} roughness={0.1} />
      </mesh>

      {/* Real-time Text on Mug */}
      <Center position={[0, 0, 1.51]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.3}
          height={0.02}
          curveSegments={12}
        >
          {text.slice(0, 15)}
          <meshStandardMaterial color="#333" roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

function KeychainModel({ config }: any) {
  const text = config?.text || 'Key';
  const materialProps = useMemo(() => {
    const mat = config?.material || 'wood';
    switch (mat) {
      case 'wood': return { color: '#8b5a2b', metalness: 0, roughness: 0.8 };
      case 'metal_alum': return { color: '#e0e0e0', metalness: 0.9, roughness: 0.1 };
      case 'leather': return { color: '#3d2b1f', metalness: 0, roughness: 0.9 };
      case 'acrylic_clear': return { color: '#ffffff', transmission: 0.95, opacity: 1, metalness: 0, roughness: 0.05, ior: 1.5, thickness: 0.1 };
      default: return { color: '#ffffff', metalness: 0.1, roughness: 0.2 };
    }
  }, [config?.material]);

  const MaterialTag = config?.material === 'acrylic_clear' ? 'meshPhysicalMaterial' : 'meshStandardMaterial';

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 4, 0.15]} />
        <MaterialTag {...materialProps} />
      </mesh>
      {/* Keychain Hole & Ring */}
      <group position={[0, 1.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.06, 12, 32]} />
          <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.05} />
        </mesh>
      </group>

      {/* Real-time Text on Keychain */}
      <Center position={[0, 0, 0.08]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.35}
          height={0.05}
          curveSegments={12}
        >
          {text.slice(0, 10)}
          <meshStandardMaterial color={config?.material === 'wood' ? '#3d2b1f' : '#111'} roughness={0.1} />
        </Text3D>
      </Center>
    </group>
  );
}

function AwardModel({ config }: any) {
  const crystalColor = '#ffffff';
  const text = config?.text || config?.recipient || 'EXCELLENCE';
  
  return (
    <group rotation={[0.1, 0, 0]}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, -2, 0]}>
        <boxGeometry args={[4, 0.8, 2]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
      </mesh>
      {/* Main Crystal Pillar */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[1.5, 2, 4.5, 4, 1]} />
        <meshPhysicalMaterial 
          color={crystalColor} 
          transmission={0.9} 
          roughness={0} 
          thickness={1.5} 
          ior={1.52} 
          clearcoat={1}
        />
      </mesh>
      {/* Engraving on Glass */}
      <Center position={[0, 0.5, 1.2]} rotation={[-0.1, 0, 0]}>
        <Text3D font="/fonts/Inter_Bold.json" size={0.3} height={0.05}>
          {text.slice(0, 15)}
          <meshStandardMaterial color="#fff" metalness={1} roughness={0.1} />
        </Text3D>
      </Center>
    </group>
  );
}

function GlasswareModel({ config }: any) {
  const text = config?.text || '';
  
  return (
    <group>
      {/* Stem & Base */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshPhysicalMaterial transmission={1} thickness={0.1} roughness={0} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 16]} />
        <meshPhysicalMaterial transmission={1} thickness={0.1} roughness={0} />
      </mesh>
      {/* Bowl */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshPhysicalMaterial 
          transmission={0.95} 
          thickness={0.05} 
          roughness={0} 
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.45, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshStandardMaterial color="#722F37" transparent opacity={0.6} roughness={0} />
      </mesh>
      {/* Etching */}
      {text && (
        <Center position={[0, 1, 1.5]} rotation={[0, 0, 0]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.2} height={0.01}>
            {text}
            <meshStandardMaterial color="#eee" opacity={0.5} transparent />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function KeepsakeBoxModel({ config }: any) {
  const woodColor = config?.material === 'cherry' ? '#8b0000' : '#c4a574';
  const text = config?.text || '';
  
  return (
    <group rotation={[0.4, -0.4, 0]}>
      {/* Box Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} />
      </mesh>
      {/* Lid (Slightly Open) */}
      <group position={[0, 1, -1.5]} rotation={[-0.2, 0, 0]}>
        <mesh castShadow position={[0, 0.25, 1.5]}>
          <boxGeometry args={[4.2, 0.5, 3.2]} />
          <meshStandardMaterial color={woodColor} roughness={0.6} />
        </mesh>
        {/* Lid Engraving */}
        {text && (
          <Center position={[0, 0.5, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <Text3D font="/fonts/Inter_Bold.json" size={0.3} height={0.02}>
              {text}
              <meshStandardMaterial color="#1a1a1a" roughness={1} />
            </Text3D>
          </Center>
        )}
      </group>
      {/* Hinges */}
      <mesh position={[-1, 1, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={1} />
      </mesh>
      <mesh position={[1, 1, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={1} />
      </mesh>
    </group>
  );
}

function NeonSignModel({ config, isNightMode }: any) {
  const text = config?.text || 'NEON';
  const color = config?.led_color || '#00f0ff';
  const intensity = isNightMode ? 5 : 1.5;
  
  return (
    <group>
      {/* Acrylic Backing */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[text.length * 1.2, 3, 0.1]} />
        <meshPhysicalMaterial transmission={0.9} thickness={0.1} roughness={0} opacity={0.3} transparent />
      </mesh>
      {/* Neon Tube (Text based with glow) */}
      <Center>
        <Text3D font="/fonts/Inter_Bold.json" size={1.5} height={0.2}>
          {text}
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={intensity} 
          />
        </Text3D>
      </Center>
      {/* Wire connections */}
      <mesh position={[0, -1.6, -0.15]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

function LeatherJournalModel({ config }: any) {
  const leatherColor = config?.color || '#3d2b1f';
  const text = config?.text || '';
  
  return (
    <group rotation={[0.4, 0.2, 0]}>
      {/* Cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial color={leatherColor} roughness={0.9} metalness={0} />
      </mesh>
      {/* Pages edge */}
      <mesh position={[1.45, 0, 0]}>
        <boxGeometry args={[0.1, 3.8, 0.4]} />
        <meshStandardMaterial color="#fffbe8" roughness={0.5} />
      </mesh>
      {/* Stitching effect (simplified) */}
      <mesh position={[0, 1.8, 0.26]}>
        <boxGeometry args={[2.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#000" opacity={0.3} transparent />
      </mesh>
      <mesh position={[0, -1.8, 0.26]}>
        <boxGeometry args={[2.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#000" opacity={0.3} transparent />
      </mesh>
      {/* Debossed Text */}
      {text && (
        <Center position={[0, 0, 0.26]}>
          <Text3D font="/fonts/Inter_Bold.json" size={0.3} height={0.01}>
            {text}
            <meshStandardMaterial color="#222" roughness={1} />
          </Text3D>
        </Center>
      )}
    </group>
  );
}

function UniversalModel({ config, productType, materialFinish, isNightMode }: any) {
  const pType = productType?.toLowerCase() || '';
  
  // Custom Neon
  if (pType.includes('neon')) {
    return <NeonSignModel config={config} isNightMode={isNightMode} />;
  }
  
  // Apparel
  if (pType.includes('hoodie') || pType.includes('polo') || pType.includes('apparel') || pType.includes('shirt')) {
    return <TShirtModel config={config} />;
  }
  if (pType.includes('cap') || pType.includes('hat')) {
    return <CapModel config={config} />;
  }
  
  // Drinkware
  if (pType.includes('mug')) {
    return <MugModel config={config} />;
  }
  if (pType.includes('glass') || pType.includes('wine')) {
    return <GlasswareModel config={config} />;
  }
  if (pType.includes('bottle') || pType.includes('flask')) {
    return <BottleModel config={config} />;
  }
  
  // Accessories
  if (pType.includes('keychain')) {
    return <KeychainModel config={config} />;
  }
  if (pType.includes('phone') || pType.includes('case')) {
    return <PhoneCaseModel config={config} />;
  }
  if (pType.includes('box') || pType.includes('keepsake')) {
    return <KeepsakeBoxModel config={config} />;
  }
  if (pType.includes('journal') || pType.includes('notebook') || pType.includes('book')) {
    return <LeatherJournalModel config={config} />;
  }
  
  // Home & Living
  if (pType.includes('board') || pType.includes('cutting')) {
    return <CuttingBoardModel config={config} />;
  }
  if (pType.includes('pillow') || pType.includes('cushion')) {
    return <PillowModel config={config} />;
  }
  if (pType.includes('candle')) {
    return <CandleModel config={config} />;
  }
  
  // Signs & Awards
  if (pType.includes('award') || pType.includes('trophy')) {
    return <AwardModel config={config} />;
  }
  if (pType.includes('plaque') || pType.includes('business') || pType.includes('sign')) {
    return <SignModel config={config} materialFinish={materialFinish} isNightMode={isNightMode} />;
  }
  
  return <SignModel config={config} materialFinish={materialFinish} isNightMode={isNightMode} />;
}

class PreviewErrorBoundary extends Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError = () => ({ hasError: true });
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#888', fontSize: '0.9rem' }}>
          3D preview unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ThreeDProductPreview({ config, productType = 'sign', materialFinish = 'matte_black', isNightMode = false }: Props) {
  return (
    <PreviewErrorBoundary>
      <div style={{ width: '100%', height: '100%', background: isNightMode ? '#050505' : '#111', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 40 }}>
        <SoftShadows size={25} samples={10} focus={0.5} />
        
        <color attach="background" args={[isNightMode ? '#050505' : '#151515']} />

        {isNightMode ? (
          <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 10, 5]} intensity={1.0} color="#444" />
            <spotLight position={[-5, 10, 5]} angle={0.25} penumbra={1} intensity={2.5} castShadow />
          </>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} />
            <Environment preset="city" environmentIntensity={materialFinish?.includes('mirror') ? 2.5 : 0.8} />
          </>
        ) }

        <Suspense fallback={null}>
          {/* Infinite Studio Backdrop */}
          <group position={[0, -5, -5]}>
            <mesh receiveShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[20, 20, 40, 64, 1, true]} />
              <meshStandardMaterial color={isNightMode ? '#050505' : '#151515'} side={THREE.BackSide} roughness={1} />
            </mesh>
          </group>

          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
            <UniversalModel config={config} productType={productType} materialFinish={materialFinish} isNightMode={isNightMode} />
          </Float>
          
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
          
          <EffectComposer>
            <Bloom 
              luminanceThreshold={isNightMode ? 0.05 : 0.9} 
              mipmapBlur 
              intensity={isNightMode ? 3.0 : 0.4} 
              radius={0.4}
            />
          </EffectComposer>
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5} 
          minDistance={5} 
          maxDistance={15} 
          autoRotate={!isNightMode}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay UI elements */}
      <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 12, fontSize: '0.7rem', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🖱️ Rotate</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🌀 Zoom</span>
      </div>
      
      {/* Product Tag */}
      <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,240,255,0.1)', padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', color: 'var(--accent-neon-blue)', fontWeight: 600, backdropFilter: 'blur(4px)', border: '1px solid rgba(0,240,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
        3D Preview Live
      </div>
    </div>
    </PreviewErrorBoundary>
  );
}

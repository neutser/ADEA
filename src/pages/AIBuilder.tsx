import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Sparkles, Image, Move, Maximize2, MoveHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { analyzeScene, getRecommendationsFromAnalysis, FALLBACK_RECOMMENDATIONS } from '@/services/aiScene';

const SCENE_CAPABLE_PRODUCTS: string[] = [];

/**
 * AI Custom Builder - Scene upload and product placement
 * Upload photo → AI analyzes → Recommendations → Drag sign into scene, resize, rotate
 * Only scene-capable products (signs) use this flow; others redirect to configurator.
 */
const AIBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product');

  // Redirect non-scene products to configurator
  useEffect(() => {
    if (productParam && !SCENE_CAPABLE_PRODUCTS.includes(productParam)) {
      navigate(`/marketplace/configure?product=${productParam}`, { replace: true });
    }
  }, [productParam, navigate]);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<{ product: string; productId: string; reason: string }[]>([]);
  const [placement, setPlacement] = useState({ x: 50, y: 50, scale: 0.3, rotation: 0 });
  const [signText, setSignText] = useState('YOUR LOGO');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; clientX: number; clientY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSceneUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setSceneImage(dataUrl);
        setIsAnalyzing(true);
        try {
          const result = await analyzeScene(dataUrl);
          setRecommendations(getRecommendationsFromAnalysis(result));
        } catch {
          setRecommendations(FALLBACK_RECOMMENDATIONS);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePlacementMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { startX: placement.x, startY: placement.y, clientX: e.clientX, clientY: e.clientY };
  }, [placement.x, placement.y]);

  const handlePlacementMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStartRef.current || !isDragging) return;
    const w = containerRef.current?.offsetWidth ?? 1;
    const h = containerRef.current?.offsetHeight ?? 1;
    const dx = (e.clientX - dragStartRef.current.clientX) / w * 100;
    const dy = (e.clientY - dragStartRef.current.clientY) / h * 100;
    const { startX, startY } = dragStartRef.current;
    setPlacement(p => ({
      ...p,
      x: Math.max(5, Math.min(95, startX + dx)),
      y: Math.max(5, Math.min(95, startY + dy)),
    }));
  }, [isDragging]);

  const handlePlacementMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const handleSnapToCenter = useCallback(() => {
    setPlacement(p => ({ ...p, x: 50, y: 50 }));
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => handlePlacementMouseMove(e);
    const onUp = () => handlePlacementMouseUp();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handlePlacementMouseMove, handlePlacementMouseUp]);

  return (
    <>
      <PageMeta
        title="AI Custom Builder"
        description="Upload a photo of your space. AI analyzes and recommends products. Preview your sign in place before purchase."
      />
      <div className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <Sparkles size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
            <h1 className="heading-xl" style={{ marginBottom: '16px' }}>AI Custom Builder</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              Upload a photo of your storefront, office, or room. AI analyzes the scene and recommends products. Place your sign and preview before purchase.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
            {/* Scene Upload & Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
              style={{
                minHeight: 500,
                padding: 0,
                overflow: 'hidden',
                position: 'sticky',
                top: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: sceneImage ? `url(${sceneImage}) center/cover` : 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
              }}
            >
              {!sceneImage ? (
                <div
                  style={{
                    padding: 60,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed var(--border-focus)',
                    borderRadius: 16,
                    margin: 24,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSceneUpload}
                    style={{ display: 'none' }}
                  />
                  <Upload size={64} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
                  <h3 className="heading-md" style={{ marginBottom: 12 }}>Upload Your Space</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Storefront, building facade, reception wall, office, bedroom, desk
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 16 }}>
                    Click or drag & drop
                  </p>
                </div>
              ) : (
                <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 450 }}>
                  {isAnalyzing && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          border: '3px solid var(--border-color)',
                          borderTopColor: 'var(--accent-neon-blue)',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      <span>AI analyzing scene...</span>
                    </div>
                  )}
                  {!isAnalyzing && (
                    <>
                      <div
                        role="button"
                        tabIndex={0}
                        onMouseDown={handlePlacementMouseDown}
                        style={{
                          position: 'absolute',
                          left: `${placement.x}%`,
                          top: `${placement.y}%`,
                          transform: `translate(-50%, -50%) scale(${placement.scale}) rotate(${placement.rotation}deg)`,
                          cursor: isDragging ? 'grabbing' : 'grab',
                          userSelect: 'none',
                          padding: '20px 40px',
                          background: 'rgba(0,0,0,0.85)',
                          border: '2px solid var(--accent-neon-blue)',
                          borderRadius: 12,
                          boxShadow: '0 0 24px rgba(0,240,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 120,
                        }}
                        aria-label="Drag to reposition sign"
                      >
                        <span style={{ color: 'var(--accent-neon-blue)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 2 }}>
                          {signText}
                        </span>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.8)',
                          padding: '12px 24px',
                          borderRadius: 20,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Move size={18} color="var(--accent-neon-blue)" />
                        <span>Drag sign to reposition · Use controls to resize & rotate</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Controls & Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
            >
              <div>
                <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Image size={20} /> Scene Upload
                </h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSceneUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {sceneImage ? 'Change Photo' : 'Choose Photo'}
                </button>
              </div>

              {sceneImage && !isAnalyzing && (
                <div>
                  <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Move size={20} color="var(--accent-neon-blue)" /> Placement
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Sign text</label>
                      <input
                        type="text"
                        value={signText}
                        onChange={(e) => setSignText(e.target.value)}
                        className="input"
                        placeholder="YOUR LOGO"
                        style={{ width: '100%' }}
                        aria-label="Sign text"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Size: {Math.round(placement.scale * 100)}%</label>
                      <input
                        type="range"
                        min={0.1}
                        max={0.8}
                        step={0.05}
                        value={placement.scale}
                        onChange={(e) => setPlacement(p => ({ ...p, scale: +e.target.value }))}
                        style={{ width: '100%' }}
                        aria-label="Sign size"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Rotate: {placement.rotation}°</label>
                      <input
                        type="range"
                        min={-15}
                        max={15}
                        step={1}
                        value={placement.rotation}
                        onChange={(e) => setPlacement(p => ({ ...p, rotation: +e.target.value }))}
                        style={{ width: '100%' }}
                        aria-label="Sign rotation"
                      />
                    </div>
                    <button type="button" className="btn btn-outline" onClick={handleSnapToCenter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <MoveHorizontal size={18} /> Snap to center
                    </button>
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={20} color="var(--accent-neon-purple)" /> AI Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recommendations.map((r, i) => (
                      <div
                        key={i}
                        className="card"
                        style={{ padding: 16, background: 'var(--bg-elevated)' }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.product}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.reason}</div>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ marginTop: 12, padding: '8px 16px', fontSize: '0.9rem' }}
                          onClick={() => {
                            try {
                              const payload = {
                                sceneImage,
                                placement: { x: placement.x, y: placement.y, scale: placement.scale, rotation: placement.rotation },
                                signText,
                                defaultConfig: (r as { defaultConfig?: Record<string, unknown> }).defaultConfig,
                              };
                              if (sceneImage || signText) {
                                sessionStorage.setItem('adea-aibuilder-scene', JSON.stringify(payload));
                              }
                            } catch {
                              /* ignore */
                            }
                            navigate(`/marketplace/configure?product=${r.productId}`);
                          }}
                        >
                          Configure
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
                <h3 className="heading-md" style={{ fontSize: '1.1rem', marginBottom: 12 }}>How it works</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  <li>1. Upload a photo of your space</li>
                  <li>2. AI detects walls, perspective, scale</li>
                  <li>3. Get product recommendations</li>
                  <li>4. Drag sign into scene, resize, preview</li>
                  <li>5. Order or request quote</li>
                </ul>
              </div>

              <Link to="/marketplace/configure?product=craft-sign" className="btn btn-primary" style={{ width: '100%' }}>
                <Maximize2 size={18} style={{ marginRight: 8 }} />
                Design Sign (No Photo)
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIBuilder;

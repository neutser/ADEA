import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Save, Share2, MessageSquare, History, Undo, Redo, Check, Upload, Wand2, Download, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageMeta } from '@/components/PageMeta';
import {
  type MarketplaceProduct, type SchemaField,
  FONT_LIBRARY, ICON_SYMBOLS, getFirstZone, parseZoneBounds
} from '@/services/CustomizationEngine';
import { trackEvent } from '@/components/AnalyticsTracker';
import { API_BASE } from '@/config';
import { PreviewRegistry } from '@/components/PreviewRegistry';
import { resolveProductId } from '@/utils/productAliases';
import type { QuoteDesignContext } from '@/pages/Quote';
import { useConfigurator } from '@/hooks/useConfigurator';
import { MACHINE_PROFILES, type MachineId } from '@/services/machineProfiles';
import { MATERIALS } from '@/data/materials';

const API = API_BASE;
const GenerativeDesignModal = lazy(() => import('@/pages/GenerativeDesignModal').then((m) => ({ default: m.GenerativeDesignModal })));

export default function AIStudioConfigurator() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addItem } = useCart();
  const { token, isAuthenticated } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    config,
    setConfig,
    quantity,
    setQuantity,
    history,
    historyIndex,
    updateConfigAndHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    pricing,
    validation,
    initForProduct,
    goToHistoryIndex,
  } = useConfigurator({ product, apiBase: API });

  // UI state
  const [rightPanelTab, setRightPanelTab] = useState<'ai' | 'history'>('ai');
  const [designBusy, setDesignBusy] = useState(false);
  const [designStatus, setDesignStatus] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [machineId, setMachineId] = useState<MachineId>('curio2');
  // 3D/scene mode disabled — always use 2D product preview

  // Fetch logic
  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(data => {
        const shareToken = params.get('share');
        const pid = params.get('product');
        if (shareToken) {
          fetch(`${API}/api/designs/share/${shareToken}`)
            .then(r => r.ok ? r.json() : null)
            .then(shareData => {
              if (!shareData?.design) return;
              const c = shareData.design.config;
              const designProductId = resolveProductId(shareData.design.product_id) || shareData.design.product_id;
              const found = (data.products || []).find((p: MarketplaceProduct) => p.id === designProductId || p.slug === designProductId);
              if (found) {
                setProduct(found);
                initForProduct(found, c);
              }
            })
            .catch(() => {});
        } else if (pid) {
          const resolvedId = resolveProductId(pid) || pid;
          const found = (data.products || []).find((p: MarketplaceProduct) => p.id === resolvedId || p.slug === resolvedId || p.id === pid || p.slug === pid);
          if (found) {
            setProduct(found);
            initForProduct(found);
            trackEvent('configurator_start', '/marketplace/configure', { productName: found.name }, found.id);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // AIBuilder scene handoff: apply scene, placement, signText, defaultConfig from sessionStorage
  useEffect(() => {
    if (!product || params.get('share')) return;
    try {
      const raw = sessionStorage.getItem('adea-aibuilder-scene');
      if (!raw) return;
      const payload = JSON.parse(raw) as {
        sceneImage?: string;
        placement?: { x: number; y: number; scale: number; rotation: number };
        signText?: string;
        defaultConfig?: Record<string, unknown>;
      };
      sessionStorage.removeItem('adea-aibuilder-scene');
      if (payload.defaultConfig && Object.keys(payload.defaultConfig).length > 0) {
        setConfig(prev => ({ ...prev, ...payload.defaultConfig }));
      }
      if (payload.signText && product.category === 'signs') {
        setConfig(prev => ({ ...prev, text: payload.signText }));
      }
      if (payload.sceneImage && product.category === 'signs') {
        setConfig(prev => ({ ...prev, sceneImage: payload.sceneImage, placement: payload.placement }));
      }
    } catch {
      /* ignore */
    }
  }, [product?.id]);

  useEffect(() => {
    // mode=scene ignored (3D disabled)
  }, [params]);

  // Hero engraving handoff: apply text from URL or sessionStorage
  useEffect(() => {
    if (!product) return;
    const urlText = params.get('text');
    const heroName = sessionStorage.getItem('adea-hero-engrave-name');
    const textToApply = (urlText ? decodeURIComponent(urlText) : '') || heroName || '';
    if (textToApply.trim()) {
      setConfig(prev => ({ ...prev, text: textToApply.trim() }));
      if (heroName) sessionStorage.removeItem('adea-hero-engrave-name');
    }
  }, [product?.id, params]);

  const schema = product?.customization_schema;

  const [activeFileField, setActiveFileField] = useState<string | null>(null);
  const [showGenModal, setShowGenModal] = useState(false);
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeFileField) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateConfigAndHistory(activeFileField, ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [activeFileField]);

  const triggerUpload = (fieldId: string) => {
    setActiveFileField(fieldId);
    fileRef.current?.click();
  };


  const handleAddToCart = () => {
    if (!product) return;
    const optionsSummary: Record<string, string> = {};
    for (const field of schema?.fields || []) {
      const val = config[field.id];
      if (!val) continue;
      if (field.options) {
        const opt = field.options.find(o => o.id === val);
        optionsSummary[field.label] = opt?.label || String(val);
      } else if (field.type !== 'image') {
        optionsSummary[field.label] = String(val);
      }
    }
    addItem({
      name: product.name,
      price: pricing.unitPrice,
      quantity,
      image: (config.artwork as string) || product.hero_image,
      options: optionsSummary,
    });
    trackEvent('add_to_cart', '/marketplace/configure', { productName: product.name, unitPrice: pricing.unitPrice, quantity }, product.id);
    navigate('/cart');
  };

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [aiFallback, setAiFallback] = useState(false);

  const aiSuggestions = useMemo(() => {
    const s = [];
    if (config.material === 'wood_oak') s.push('Wood grain is highly organic. Ensure text size is large enough to remain legible over grain lines.');
    if (config.material === 'gold_mirror') s.push('Gold mirror creates high reflection. Avoid putting fine details near edges to prevent glare hotspots.');
    if (config.led) s.push('You selected LED Backlighting. Consider using a matte surface finish for the face to maximize the halo effect contrast.');
    if (config.text && String(config.text).length > 15) s.push('Long text detected. For optimal readability on 3D letters, consider breaking text onto two lines.');
    if (s.length === 0) s.push('Design looks great. Try experimenting with the night mode lighting toggle below the canvas to see realistic shadows.');
    return s;
  }, [config]);

  const handleGenSelect = useCallback((dataUrl: string) => {
    const imageField = schema?.fields?.find((f) => f.type === 'image' || f.id === 'logo' || f.id === 'artwork' || f.id === 'photo');
    if (imageField) {
      updateConfigAndHistory(imageField.id, dataUrl);
    } else {
      updateConfigAndHistory('logo', dataUrl);
    }
  }, [schema]);

  /* ── Save / Share ──────────────────────────────────────────
     Both buttons were wired to `onClick={() => null}`. The backend has had
     POST /api/designs (returning { id, shareToken }) all along — the share
     link it produces is what the ?share= loader above already consumes. */
  const persistDesign = useCallback(async (): Promise<{ id: string; shareToken: string }> => {
    if (!product) throw new Error('No product loaded.');
    const res = await fetch(`${API}/api/designs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ productId: product.id, config, name: product.name }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || `Could not save design (${res.status}).`);
    }
    return (await res.json()) as { id: string; shareToken: string };
  }, [product, config, token]);

  const requireSignIn = useCallback((action: string) => {
    setDesignStatus({ tone: 'error', text: `Sign in to ${action} designs.` });
    const back = `${window.location.pathname}${window.location.search}`;
    void navigate(`/login?redirect=${encodeURIComponent(back)}`);
  }, [navigate]);

  const handleSaveDesign = useCallback(async () => {
    if (!isAuthenticated) return requireSignIn('save');
    setDesignBusy(true);
    setDesignStatus(null);
    try {
      await persistDesign();
      setDesignStatus({ tone: 'success', text: 'Design saved to your account.' });
      trackEvent('design_save', '/marketplace/configure', { productName: product?.name }, product?.id);
    } catch (err) {
      setDesignStatus({ tone: 'error', text: err instanceof Error ? err.message : 'Could not save design.' });
    } finally {
      setDesignBusy(false);
    }
  }, [isAuthenticated, requireSignIn, persistDesign, product]);

  const handleShareDesign = useCallback(async () => {
    if (!isAuthenticated) return requireSignIn('share');
    setDesignBusy(true);
    setDesignStatus(null);
    try {
      const saved = await persistDesign();
      if (!saved?.shareToken) throw new Error('Server did not return a share link.');
      const url = `${window.location.origin}/marketplace/configure?share=${saved.shareToken}`;
      let copied = false;
      try {
        await navigator.clipboard?.writeText(url);
        copied = true;
      } catch {
        // Clipboard needs a secure context and permission; show the link instead.
      }
      setDesignStatus({ tone: 'success', text: copied ? 'Share link copied to clipboard.' : url });
      trackEvent('design_share', '/marketplace/configure', { productName: product?.name }, product?.id);
    } catch (err) {
      setDesignStatus({ tone: 'error', text: err instanceof Error ? err.message : 'Could not share design.' });
    } finally {
      setDesignBusy(false);
    }
  }, [isAuthenticated, requireSignIn, persistDesign, product]);

  const handleStudioExport = useCallback(async () => {
    if (!product) return;
    const format = machineId === 'curio2' ? 'curio' : 'xtool';
    const res = await fetch(`${API}/api/export/design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        config: { ...config, vectorPath: config.vectorPath || config.paths },
        schema: product.customization_schema,
        format,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Export failed');
      return;
    }
    const blob = await res.blob();
    const ext = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1]?.split('.').pop() || 'svg';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `design-${product.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [product, config, machineId]);

  const estimatedMaterialCost = useMemo(() => {
    const materialValue = String(config.material || '').toLowerCase();
    const matched = MATERIALS.find((m) => m.id.includes(materialValue) || m.name.toLowerCase().includes(materialValue));
    const materialCost = matched?.basePrice || 0;
    const complexity = Math.max(1, Object.keys(config).filter((k) => config[k] !== undefined && config[k] !== '').length);
    return materialCost + (complexity * 0.35) + 5;
  }, [config]);

  const handleSendChat = useCallback(async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading || !product) return;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/design-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          productId: product.id,
          productName: product.name,
          productCategory: product.category,
          config,
          schema: product.customization_schema,
          conversationHistory: chatMessages.slice(-6),
        }),
      });
      const data = await res.json();
      if (res.status === 503 && data.code === 'AI_UNAVAILABLE') {
        setAiFallback(true);
        setChatMessages((prev) => prev.slice(0, -1));
      } else if (res.ok && data.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Sorry, I could not respond.' }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, product, config, chatMessages]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!product || !schema) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => navigate('/marketplace')}>Return to Catalog</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-color)' }}>
      <PageMeta title={`AI Studio - ${product.name}`} />
      
      {/* Top action bar overriding normal header */}
      <div style={{ minHeight: 72, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Sparkles color="var(--accent-neon-blue)" size={24} />
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Adea Unified Studio</h1>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ fontSize: '1rem', color: '#ccc' }}>{product.name}</span>
          <select
            className="input-field"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value as MachineId)}
            aria-label="Select machine profile"
            style={{ width: 190, padding: '8px 12px', marginLeft: 8 }}
          >
            {MACHINE_PROFILES.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginRight: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginRight: 8 }}>Total</span>
            ${pricing.lineTotal.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Est. studio cost: <strong style={{ color: 'var(--accent-neon-blue)' }}>${estimatedMaterialCost.toFixed(2)}</strong>
          </div>
          <button className="btn btn-outline" onClick={handleStudioExport} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <Download size={14} style={{ marginRight: 6 }} /> Export
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/quote', { state: { fromDesign: { productId: product.id, productName: product.name, config, quantity, estimatedTotal: pricing.lineTotal, sceneImage: config.sceneImage as string | undefined } satisfies QuoteDesignContext } })}
            style={{ padding: '8px 20px', fontSize: '0.9rem', borderColor: 'var(--accent-neon-blue)', color: 'var(--accent-neon-blue)' }}
          >
            Request Quote
          </button>
          <button className="btn btn-primary" onClick={handleAddToCart} style={{ padding: '8px 24px', fontSize: '0.9rem' }}>Add to Cart</button>
        </div>
      </div>

      <div className="ai-studio-layout">
        
        {/* ==================== LEFT: CONTROLS ==================== */}
        <div className="ai-studio-panel glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--accent-neon-blue)', textTransform: 'uppercase', letterSpacing: 1 }}>Configuration</h2>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowGenModal(true)}
            style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}
          >
            <Wand2 size={16} /> Generate from prompt
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {schema.fields.map(field => (
              <FieldRenderer key={field.id} field={field} value={config[field.id]} onChange={(val) => updateConfigAndHistory(field.id, val)} onUpload={() => triggerUpload(field.id)} />
            ))}
            <input type="file" ref={fileRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} aria-label="Upload design image" />
            {getFirstZone(schema) && (config.text || config.subtext || config.logo || config.artwork || config.photo) ? (
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 12, background: 'rgba(255,255,255,0.02)', marginTop: 12 }}>
                <h3 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>Design Position</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Adjust position and scale of your text or logo on the product</p>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  X
                  <input type="range" min={0} max={100} step={2} value={Math.round(((config.zonePlacement as any)?.x ?? 0.5) * 100)} onChange={(e) => updateConfigAndHistory('zonePlacement', { ...(config.zonePlacement as any || { x: 0.5, y: 0.5, scale: 1 }), x: Number(e.target.value) / 100 })} style={{ width: '100%' }} aria-label="Artwork horizontal position" />
                </label>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Y
                  <input type="range" min={0} max={100} step={2} value={Math.round(((config.zonePlacement as any)?.y ?? 0.5) * 100)} onChange={(e) => updateConfigAndHistory('zonePlacement', { ...(config.zonePlacement as any || { x: 0.5, y: 0.5, scale: 1 }), y: Number(e.target.value) / 100 })} style={{ width: '100%' }} aria-label="Artwork vertical position" />
                </label>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Scale
                  <input type="range" min={50} max={150} step={5} value={Math.round(((config.zonePlacement as any)?.scale ?? 1) * 100)} onChange={(e) => updateConfigAndHistory('zonePlacement', { ...(config.zonePlacement as any || { x: 0.5, y: 0.5, scale: 1 }), scale: Number(e.target.value) / 100 })} style={{ width: '100%' }} aria-label="Artwork scale" />
                </label>
              </div>
            ) : null}
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quantity</span>
              <input type="number" min={1} className="input-field" value={quantity} onChange={e => setQuantity(Math.max(1, +e.target.value))} style={{ width: 80, padding: '6px 12px', textAlign: 'center' }} aria-label="Quantity" />
            </div>
            {pricing.discount > 0 && (
              <div style={{ background: 'rgba(255,153,0,0.1)', color: '#ff9900', padding: '6px 12px', borderRadius: 6, fontSize: '0.82rem', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>Bulk Discount applied</span><strong>-{pricing.discount}%</strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: 8, fontSize: '0.8rem' }}
                onClick={() => void handleShareDesign()}
                disabled={designBusy}
              >
                <Share2 size={14} style={{ marginRight: 6 }}/> Share
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: 8, fontSize: '0.8rem' }}
                onClick={() => void handleSaveDesign()}
                disabled={designBusy}
              >
                <Save size={14} style={{ marginRight: 6 }}/> {designBusy ? 'Saving…' : 'Save'}
              </button>
            </div>
            {designStatus && (
              <p
                role="status"
                style={{
                  marginTop: 10,
                  fontSize: '0.75rem',
                  wordBreak: 'break-all',
                  color: designStatus.tone === 'error' ? '#ff6b6b' : 'var(--accent-neon-blue)',
                }}
              >
                {designStatus.text}
              </p>
            )}
          </div>
        </div>

        {/* ==================== CENTER: 3D CANVAS ==================== */}
        <div className="ai-studio-canvas">
          <PreviewRegistry
            previewType={schema.preview?.type ?? 'flat-artwork'}
            config={config}
            productCategory={product.category}
            productSubcategory={product.subcategory}
            sceneImage={config.sceneImage as string | undefined}
            isNightMode={isNightMode}
            heroImage={product.hero_image}
            zoneBounds={schema ? (() => { const z = getFirstZone(schema); return z ? parseZoneBounds(z) : undefined; })() : undefined}
          />
          
          <div className="floating-toolbar glass-panel">
            <button className={`tool-btn ${!isNightMode ? 'active' : ''}`} onClick={() => { setIsNightMode(false); trackEvent('configurator_day_mode', '/marketplace/configure', { productId: product?.id }); }} title="Studio Lighting (Day)">
              ☀️
            </button>
            <button className={`tool-btn ${isNightMode ? 'active' : ''}`} onClick={() => { setIsNightMode(true); trackEvent('configurator_night_mode', '/marketplace/configure', { productId: product?.id }); }} title="Realistic Shadows (Night)">
              🌙
            </button>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
            <button className="tool-btn" onClick={undo} disabled={!canUndo} title="Undo">
              <Undo size={18} opacity={canUndo ? 1 : 0.3} />
            </button>
            <button className="tool-btn" onClick={redo} disabled={!canRedo} title="Redo">
              <Redo size={18} opacity={canRedo ? 1 : 0.3} />
            </button>
          </div>
        </div>

        {/* ==================== RIGHT: AI ASSISTANT & HISTORY ==================== */}
        <div className="ai-studio-panel glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderRight: 0 }}>
          
          <div style={{ display: 'flex', marginBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
            <button onClick={() => setRightPanelTab('ai')} style={{ flex: 1, padding: '12px 0', borderBottom: rightPanelTab === 'ai' ? '2px solid var(--accent-neon-purple)' : '2px solid transparent', color: rightPanelTab === 'ai' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <MessageSquare size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Assistant
            </button>
            <button onClick={() => setRightPanelTab('history')} style={{ flex: 1, padding: '12px 0', borderBottom: rightPanelTab === 'history' ? '2px solid var(--accent-neon-blue)' : '2px solid transparent', color: rightPanelTab === 'history' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <History size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Versions
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {rightPanelTab === 'ai' && (
              <>
                {aiFallback ? (
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>AI chat unavailable. Design tips:</p>
                    <AnimatePresence>
                      {aiSuggestions.map((suggestion, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: 16, background: 'rgba(176, 38, 255, 0.05)', border: '1px solid rgba(176, 38, 255, 0.2)', borderRadius: 12, marginBottom: 12 }}>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <Sparkles size={16} color="var(--accent-neon-purple)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: '0.85rem', color: '#ddd', lineHeight: 1.5 }}>{suggestion}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
                      {chatMessages.length === 0 && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ask about materials, sizing, placement, or design tips.</p>
                      )}
                      {chatMessages.map((m, idx) => (
                        <div key={idx} style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div style={{ maxWidth: '90%', padding: 12, borderRadius: 12, background: m.role === 'user' ? 'rgba(0,240,255,0.1)' : 'rgba(176, 38, 255, 0.08)', border: `1px solid ${m.role === 'user' ? 'rgba(0,240,255,0.2)' : 'rgba(176, 38, 255, 0.2)'}` }}>
                            <p style={{ fontSize: '0.85rem', color: '#ddd', lineHeight: 1.5 }}>{m.content}</p>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Thinking...</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        className="input-field"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                        placeholder="Ask about your design..."
                        disabled={chatLoading}
                        style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem' }}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleSendChat}
                        disabled={chatLoading || !chatInput.trim()}
                        style={{ padding: '10px 16px' }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {rightPanelTab === 'history' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Compare or revert to previous versions of your design session.
                </p>
                {history.map((h, idx) => (
                  <div key={idx} onClick={() => goToHistoryIndex(idx)} style={{ padding: 12, border: `1px solid ${idx === historyIndex ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`, background: idx === historyIndex ? 'rgba(0,240,255,0.05)' : 'var(--bg-elevated)', borderRadius: 8, marginBottom: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Version {idx + 1}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Object.keys(h).length} attributes</div>
                    </div>
                    {idx === historyIndex && <Check size={16} color="var(--accent-neon-blue)" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, border: '1px solid var(--border-color)', borderRadius: 8, padding: 12, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <Layers size={14} /> Studio Layers
            </div>
            <div style={{ fontSize: '0.82rem', color: '#ddd', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Artwork: {(config.logo || config.artwork || config.photo) ? 'Loaded' : 'None'}</span>
              <span>Material: {String(config.material || 'Default')}</span>
            </div>
          </div>

          {validation.warnings.length > 0 && rightPanelTab === 'ai' && (
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--accent-amber)', borderRadius: 8, padding: 16, marginTop: 'auto' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginBottom: 8, fontWeight: 700 }}>Design Warnings</h4>
              {validation.warnings.map((w, i) => <div key={i} style={{ fontSize: '0.8rem', color: '#ffddaa', marginBottom: 4 }}>• {w}</div>)}
            </div>
          )}
        </div>
        
      </div>
      {showGenModal && (
        <Suspense fallback={<div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div>}>
          <GenerativeDesignModal
            isOpen={showGenModal}
            onClose={() => setShowGenModal(false)}
            onSelectImage={handleGenSelect}
            productCategory={product?.category}
            style={config.style as string | undefined}
          />
        </Suspense>
      )}
    </div>
  );
}

function FieldRenderer({ field, value, onChange, onUpload }: {
  field: SchemaField;
  value: any;
  onChange: (val: any) => void;
  onUpload: () => void;
}) {
  const labelEl = (
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#e0e0e0' }}>
      {field.label}
      {field.required === false && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>(optional)</span>}
    </h3>
  );

  switch (field.type) {
    case 'text':
      return (
        <div>{labelEl}
          <input type="text" className="input-field" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} maxLength={field.maxLen} style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px' }} aria-label={field.label} />
        </div>
      );
    case 'number':
      return (
        <div>{labelEl}
          <input type="number" className="input-field" value={value ?? field.min ?? 0} onChange={e => onChange(+e.target.value)} min={field.min} max={field.max} style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px' }} aria-label={field.label} />
        </div>
      );
    case 'select':
      return (
        <div>{labelEl}
          <select className="input-field" value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px' }} aria-label={field.label}>
            {!field.options?.some(o => o.id === value) && <option value="" disabled>Select an option…</option>}
            {field.options?.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      );
    case 'radio':
      return (
        <div>{labelEl}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {field.options?.map(o => (
              <button key={o.id} type="button" onClick={() => onChange(o.id)} style={{ flex: '1 1 45%', padding: '8px', borderRadius: 6, background: value === o.id ? 'rgba(0,240,255,0.1)' : 'var(--bg-elevated)', border: `1px solid ${value === o.id ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      );
    case 'textarea':
      return (
        <div>{labelEl}
          <textarea className="input-field" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={field.rows || 3} style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px', resize: 'vertical' }} aria-label={field.label} />
        </div>
      );
    case 'slider':
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            {labelEl}
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-neon-blue)' }}>{String(value ?? field.default ?? '')}{field.unit ?? ''}</span>
          </div>
          <input type="range" min={field.min} max={field.max} step={field.step} value={value ?? field.default} onChange={e => onChange(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-neon-blue)' }} aria-label={field.label} />
        </div>
      );
    case 'color-swatch':
      return (
        <div>{labelEl}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {field.options?.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => onChange(o.id)}
                title={o.label}
                aria-label={o.label}
                aria-pressed={value === o.id}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: o.hex || '#ccc',
                  border: `2px solid ${value === o.id ? 'var(--accent-neon-blue)' : 'transparent'}`,
                  boxShadow: value === o.id ? '0 0 10px var(--accent-neon-blue)' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>
      );
    case 'font-picker':
      return (
        <div>{labelEl}
          <select className="input-field" value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px' }} aria-label={field.label}>
            {!FONT_LIBRARY.some(f => f.id === value) && <option value="" disabled>Select a font…</option>}
            {FONT_LIBRARY.map(f => (
              <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.name}</option>
            ))}
          </select>
        </div>
      );
    case 'icon-picker': {
      // Seeded products declare `{ id: 'icon', type: 'icon-picker' }` with no
      // `icons` array, so fall back to the full symbol library rather than a
      // hardcoded four. Buttons show the glyph, not the raw id.
      const icons = field.icons?.length ? field.icons : Object.keys(ICON_SYMBOLS);
      return (
        <div>{labelEl}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => onChange(icon)}
                title={icon}
                aria-label={icon}
                aria-pressed={value === icon}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: value === icon ? 'rgba(0,240,255,0.1)' : 'var(--bg-elevated)',
                  border: `1px solid ${value === icon ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {icon === 'none' ? '\u2205' : (ICON_SYMBOLS[icon] ?? icon)}
              </button>
            ))}
          </div>
        </div>
      );
    }
    case 'checkbox':
      // The schema type, buildDefaults and calculatePrice all support checkbox
      // fields, but the renderer had no case for them — they fell through to
      // `default: return null` and were invisible (and unpriceable) in the UI.
      return (
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: '#e0e0e0' }}>
            <input
              type="checkbox"
              checked={!!value}
              onChange={e => onChange(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent-neon-blue)', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 600 }}>{field.label}</span>
            {field.priceAdd ? (
              <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--accent-neon-blue)' }}>
                +${field.priceAdd}
              </span>
            ) : null}
          </label>
        </div>
      );
    case 'image':
      return (
        <div>{labelEl}
          <div onClick={onUpload} style={{ border: '1px dashed var(--border-focus)', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s ease' }}>
            {value ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <img src={value} style={{ maxHeight: 60, borderRadius: 4 }} alt="Upload preview" />
                <span style={{ color: 'var(--accent-neon-blue)', fontSize: '0.75rem', fontWeight: 600 }}>IMAGE READY ✓</span>
              </div>
            ) : (
              <div style={{ padding: '10px 0' }}>
                <Upload size={20} color="var(--text-muted)" style={{ marginBottom: 4 }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Click to upload artwork</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>PNG, SVG or JPEG</p>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return null;
    }
}

import React, { useState } from 'react';
import { Download, FileText, Layers, Box, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import {
  generateSVGCutFiles,
  generateDXFCutFile,
  generateMaterialList,
  generateAssemblyDiagram,
  generateDSTFile,
  generatePrintPlacementFile,
  downloadFile,
  validateDesign,
  type DesignConfig,
} from '@/services/fileGeneration';
import { CanvasProductPreview } from '@/components/CanvasProductPreview';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

const files = [
  { order: 'ORD-1042', product: '3D Layered Logo – Acme Corp', files: [
    { name: 'acme_layer1_front.svg', type: 'SVG Cut File', size: '142 KB', desc: 'Front face layer (8mm clear acrylic)' },
    { name: 'acme_layer2_mid.svg', type: 'SVG Cut File', size: '98 KB', desc: 'Mid spacer layer (5mm clear acrylic)' },
    { name: 'acme_layer3_back.dxf', type: 'DXF Cut File', size: '210 KB', desc: 'Backing plate (3mm black acrylic)' },
    { name: 'acme_assembly.pdf', type: 'Assembly Plan', size: '1.2 MB', desc: 'Layered assembly diagram with standoff placement' },
  ]},
  { order: 'ORD-1041', product: 'LED Backlit Logo – Modern Barber', files: [
    { name: 'barber_logo_cut.svg', type: 'SVG Cut File', size: '88 KB', desc: 'Logo outline cut (5mm white acrylic)' },
    { name: 'barber_led_channel.dxf', type: 'DXF Cut File', size: '64 KB', desc: 'LED channel routing path' },
    { name: 'barber_backplate.svg', type: 'SVG Cut File', size: '52 KB', desc: 'Mounting backplate (3mm matte black)' },
    { name: 'barber_wiring.pdf', type: 'Assembly Plan', size: '890 KB', desc: 'LED wiring diagram + driver placement' },
  ]},
  { order: 'ORD-1040', product: 'Engraved Menu Board – Café Luz', files: [
    { name: 'cafeluz_menu_engrave.svg', type: 'SVG Engrave File', size: '320 KB', desc: 'Full menu text engraving layout (6mm oak, A3)' },
    { name: 'cafeluz_border_cut.dxf', type: 'DXF Cut File', size: '28 KB', desc: 'Decorative border cut lines' },
  ]},
];

function designConfigFromDesign(designConfig: Record<string, unknown>): DesignConfig {
  const mode = (designConfig.mode as string) || 'sign';
  const type = mode as 'sign' | 'craft' | 'apparel';
  const widthCm = (designConfig.widthCm as number) || 60;
  const heightCm = widthCm * 0.5;
  const text = (designConfig.text as string) || 'Sample';
  const subtext = (designConfig.subtext as string) || '';
  const shape = ((designConfig.shape as { id?: string })?.id ?? designConfig.shape as string ?? (designConfig.signShape as { id?: string })?.id ?? 'rounded') as DesignConfig['shape'];
  const material = (designConfig.signMaterial as string) || (designConfig.craftMaterial as string) || 'acrylic';
  const pl = designConfig.placement;
  const placement = (typeof pl === 'object' && pl && 'id' in pl) ? (pl as { id: string }).id : (pl as string | undefined);
  const logoFile = designConfig.logoFile as string | undefined;
  return {
    type,
    text,
    subtext,
    widthCm,
    heightCm,
    material: material?.replace('acrylic_clear', 'acrylic').replace('acrylic_black', 'acrylic') || 'acrylic',
    shape: ['circle', 'rounded', 'square'].includes(shape || '') ? (shape as 'circle'|'rounded'|'square') : 'rounded',
    placement,
    artworkUrl: logoFile,
  };
}

const FileGenerator: React.FC = () => {
  const { token } = useAuth();
  const [config, setConfig] = useState<DesignConfig>({ type: 'sign', text: 'Sample', subtext: '', widthCm: 10, heightCm: 10, material: 'acrylic', shape: 'rounded' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadId, setLoadId] = useState('');
  const [loadType, setLoadType] = useState<'design' | 'order'>('design');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadSVG = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const svgFiles = generateSVGCutFiles(config);
    svgFiles.forEach(f => downloadFile(f.content, f.name, f.mimeType));
  };

  const handleDownloadDXF = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const f = generateDXFCutFile(config);
    downloadFile(f.content, f.name, f.mimeType);
  };

  const handleDownloadMaterialList = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const f = generateMaterialList(config);
    downloadFile(f.content, f.name, f.mimeType);
  };

  const handleDownloadAssembly = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const f = generateAssemblyDiagram(config);
    downloadFile(f.content, f.name, f.mimeType);
  };

  const handleDownloadDST = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const f = generateDSTFile(config);
    downloadFile(f.content, f.name, f.mimeType);
  };

  const handleDownloadPrintPlacement = () => {
    const { valid, errors } = validateDesign(config);
    setValidationErrors(errors);
    if (!valid) return;
    const f = generatePrintPlacementFile(config);
    downloadFile(f.content, f.name, f.mimeType);
  };

  const handleLoadFromDesignOrOrder = async () => {
    if (!loadId.trim() || !token) return;
    setLoadError(null);
    setLoading(true);
    try {
      if (loadType === 'design') {
        const res = await fetch(`${API_BASE}/api/designs/${loadId.trim()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Design not found (${res.status})`);
        }
        const { design } = await res.json();
        const cfg = designConfigFromDesign(design.config || {});
        setConfig(cfg);
      } else {
        const res = await fetch(`${API_BASE}/api/orders/${loadId.trim()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Order not found (${res.status})`);
        }
        const order = await res.json();
        if (!order.design) throw new Error('This order has no linked design');
        const cfg = designConfigFromDesign(order.design.config || {});
        setConfig(cfg);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">

        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-lg">Production File Generator</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Auto-generated SVG, DXF, and assembly files ready for laser cutting.</p>
        </div>

        {/* Load from Design or Order */}
        {token && (
          <div className="card glass-panel" style={{ marginBottom: '24px', padding: '20px' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={18} color="var(--accent-neon-blue)"/> Load from Design or Order
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Enter a design ID or order ID to pre-fill the config from saved data.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={loadType} onChange={e => setLoadType(e.target.value as 'design' | 'order')} className="input" style={{ width: '120px' }}>
                <option value="design">Design ID</option>
                <option value="order">Order ID</option>
              </select>
              <input
                type="text"
                value={loadId}
                onChange={e => { setLoadId(e.target.value); setLoadError(null); }}
                placeholder={loadType === 'design' ? 'e.g. abc-123...' : 'e.g. ORD-ABC123'}
                className="input"
                style={{ flex: 1, minWidth: '180px' }}
              />
              <button className="btn btn-primary" onClick={handleLoadFromDesignOrOrder} disabled={loading || !loadId.trim()}>
                {loading ? <Loader2 size={18} className="spin" style={{ animation: 'spin 0.8s linear infinite' }} /> : <FileText size={18} />}
                {loading ? ' Loading...' : ' Load'}
              </button>
            </div>
            {loadError && <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', marginTop: '8px' }}>{loadError}</p>}
          </div>
        )}

        {/* Canvas preview (A6) */}
        <div className="card glass-panel" style={{ marginBottom: '24px', padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-neon-blue)"/> Canvas Preview
          </h2>
          <CanvasProductPreview config={config} width={360} height={240} />
        </div>

        {/* Generate from design config */}
        <div className="card glass-panel slide-up" style={{ marginBottom: '32px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--accent-neon-blue)"/> Generate Production Files
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Text</label>
              <input type="text" value={config.text || ''} onChange={e => setConfig(c => ({ ...c, text: e.target.value }))} className="input" placeholder="Main text" aria-label="Main text" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Subtext</label>
              <input type="text" value={config.subtext || ''} onChange={e => setConfig(c => ({ ...c, subtext: e.target.value }))} className="input" placeholder="Optional" aria-label="Subtext" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Width (cm)</label>
              <input type="number" min={1} max={120} value={config.widthCm ?? 10} onChange={e => setConfig(c => ({ ...c, widthCm: +e.target.value || 10 }))} className="input" aria-label="Width in cm" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Height (cm)</label>
              <input type="number" min={1} max={120} value={config.heightCm ?? 10} onChange={e => setConfig(c => ({ ...c, heightCm: +e.target.value || 10 }))} className="input" aria-label="Height in cm" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Shape</label>
              <select value={config.shape || 'rounded'} onChange={e => setConfig(c => ({ ...c, shape: e.target.value as DesignConfig['shape'] }))} className="input" aria-label="Shape" style={{ width: '100%' }}>
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
                <option value="circle">Circle</option>
              </select>
            </div>
          </div>
          {validationErrors.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', background: 'rgba(255,68,68,0.1)', borderRadius: '8px', marginBottom: '16px' }}>
              <AlertCircle size={18} color="#ff4444" style={{ flexShrink: 0 }} />
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.9rem', color: '#ff6666' }}>
                {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleDownloadSVG} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18}/> SVG Cut
            </button>
            <button className="btn btn-outline" onClick={handleDownloadDXF} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={18}/> DXF Cut
            </button>
            <button className="btn btn-outline" onClick={handleDownloadMaterialList} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18}/> Material List
            </button>
            <button className="btn btn-outline" onClick={handleDownloadAssembly} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18}/> Assembly Diagram
            </button>
            <button className="btn btn-outline" onClick={handleDownloadDST} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18}/> DST Embroidery
            </button>
            <button className="btn btn-outline" onClick={handleDownloadPrintPlacement} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18}/> Print Placement
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {files.map((order, i) => (
            <div key={i} className="card glass-panel slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--accent-neon-blue)', fontWeight: 700, marginRight: '12px' }}>{order.order}</span>
                  <span style={{ fontWeight: 600 }}>{order.product}</span>
                </div>
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: '6px' }}>
                  <Download size={16}/> Download All (.zip)
                </button>
              </div>

              <div style={{ padding: '0' }}>
                {order.files.map((file, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: j < order.files.length - 1 ? '1px solid var(--border-color)' : 'none', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: file.type.includes('SVG') ? 'rgba(0,240,255,0.1)' : file.type.includes('DXF') ? 'rgba(176,38,255,0.1)' : 'rgba(255,153,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {file.type.includes('Assembly') ? <Layers size={20} color="#ff9900"/> : file.type.includes('DXF') ? <Box size={20} color="#b026ff"/> : <FileText size={20} color="#00f0ff"/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '2px' }}>{file.name}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{file.desc}</p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{file.type}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '70px', textAlign: 'right' }}>{file.size}</span>
                    <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', gap: '4px' }}>
                      <Download size={14}/> Get
                    </button>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FileGenerator;

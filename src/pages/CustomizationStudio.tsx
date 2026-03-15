/**
 * CustomizationStudio — Professional 2D design editor (Zazzle-style).
 * Fabric.js canvas, layer panel, toolbar, product preview, save/share.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Type, Square, Circle, Undo, Redo, Save, Share2, Upload, Group, Ungroup, Download } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';
import { DesignCanvas, type DesignCanvasHandle } from '@/components/customization/DesignCanvas';
import { LayerPanel } from '@/components/customization/LayerPanel';
import { EffectToolbar } from '@/components/customization/EffectToolbar';
import { TypographyPanel } from '@/components/customization/TypographyPanel';
import { ImageFiltersPanel } from '@/components/customization/ImageFiltersPanel';
import { ProductPreviewPane } from '@/components/customization/ProductPreviewPane';
import { useDesignStore } from '@/stores/designStore';
import { designToConfigJson, configJsonToDesign } from '@/services/designSerializer';
import { resolveProductId } from '@/utils/productAliases';
import { API_BASE } from '@/config';
import type { MarketplaceProduct } from '@/services/CustomizationEngine';

const API = API_BASE;

export default function CustomizationStudio() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const canvasRef = useRef<DesignCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    layers,
    zoneBounds,
    setLayers,
    setZoneBounds,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDesignStore();

  // Fetch products
  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        const shareToken = params.get('share');
        const pid = params.get('product');
        if (shareToken) {
          fetch(`${API}/api/designs/share/${shareToken}`)
            .then((r) => (r.ok ? r.json() : null))
            .then(async (shareData) => {
              if (!shareData?.design) return;
              const c = shareData.design.config;
              const designProductId = resolveProductId(shareData.design.product_id) || shareData.design.product_id;
              const found = (data.products || []).find(
                (p: MarketplaceProduct) => p.id === designProductId || p.slug === designProductId
              );
              if (found) {
                setProduct(found);
                const doc = configJsonToDesign(
                  typeof c === 'string' ? c : JSON.stringify(c),
                  found.id
                );
                if (doc) {
                  setLayers(doc.layers);
                  setZoneBounds(doc.zoneBounds);
                }
              }
            })
            .catch(() => {});
        } else if (pid) {
          const resolvedId = resolveProductId(pid) || pid;
          const found = (data.products || []).find(
            (p: MarketplaceProduct) =>
              p.id === resolvedId || p.slug === resolvedId || p.id === pid || p.slug === pid
          );
          if (found) setProduct(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Sync product to store
  useEffect(() => {
    if (product) {
      useDesignStore.getState().setProduct(product.id, product.name, product.hero_image);
    }
  }, [product]);

  const schema = product?.customization_schema ?? null;

  // Restore canvas when layers change (undo, redo, layer panel, share load)
  useEffect(() => {
    if (product && canvasRef.current) {
      canvasRef.current.restoreFromStore();
    }
  }, [product, layers]);

  const handleUndo = useCallback(() => {
    undo();
    canvasRef.current?.restoreFromStore();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
    canvasRef.current?.restoreFromStore();
  }, [redo]);

  const handleAddText = useCallback(() => {
    const text = prompt('Enter text:');
    if (text) canvasRef.current?.addText(text);
  }, []);

  const handleAddImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (url) canvasRef.current?.addImageFromUrl(url);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    []
  );

  const handleExport = useCallback(async () => {
    if (!product) return;
    const doc = {
      productId: product.id,
      layers,
      zoneBounds,
      version: 1,
      configVersion: 2 as const,
    };
    const config = JSON.parse(designToConfigJson(doc));
    try {
      const res = await fetch(`${API}/api/export/design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          config,
          schema: product.customization_schema,
          format: 'svg',
        }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `design-${product.id}.svg`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert('Export failed.');
    }
  }, [product, layers, zoneBounds]);

  const handleSave = useCallback(async () => {
    if (!product) return;
    const doc = {
      productId: product.id,
      layers,
      zoneBounds,
      version: 1,
      configVersion: 2 as const,
    };
    const config = JSON.parse(designToConfigJson(doc));
    try {
      const res = await fetch(`${API}/api/designs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({ productId: product.id, config }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        alert('Design saved!');
        return data.shareToken as string | undefined;
      } else {
        alert(data.error || 'Save failed. You may need to log in.');
        return undefined;
      }
    } catch {
      alert('Failed to save design.');
      return undefined;
    }
  }, [product, layers, zoneBounds]);

  const handleShare = useCallback(async () => {
    const token = await handleSave();
    if (!token) return;
    const url = `${window.location.origin}/marketplace/design-studio?share=${token}`;
    await navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  }, [handleSave]);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-color)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-neon-blue)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!product || !schema) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-color)',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2>Select a Product</h2>
          <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>
            Add ?product=craft-keychain to the URL or choose from the catalog.
          </p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/marketplace')}
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      <PageMeta title={`2D Studio - ${product.name}`} />

      {/* Top bar */}
      <div
        style={{
          minHeight: 56,
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'rgba(10,10,10,0.9)',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>2D Customization Studio</h1>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ fontSize: '0.95rem', color: '#ccc' }}>{product.name}</span>
          <select
            className="input-field"
            value={product.id}
            onChange={(e) => {
              const p = products.find((x) => x.id === e.target.value);
              if (p) setProduct(p);
            }}
            aria-label="Select product"
            style={{ width: 180, padding: '6px 10px', fontSize: '0.9rem' }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleUndo}
            disabled={!canUndo()}
            aria-label="Undo"
            style={{ padding: '6px 10px' }}
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleRedo}
            disabled={!canRedo()}
            aria-label="Redo"
            style={{ padding: '6px 10px' }}
          >
            <Redo size={16} />
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExport}
            style={{ padding: '6px 14px' }}
          >
            <Download size={16} style={{ marginRight: 6 }} /> Export
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleShare}
            style={{ padding: '6px 14px' }}
          >
            <Share2 size={16} style={{ marginRight: 6 }} /> Share
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleSave}
            style={{ padding: '6px 14px' }}
          >
            <Save size={16} style={{ marginRight: 6 }} /> Save
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gridTemplateRows: '1fr auto',
          gap: 0,
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        {/* Main canvas area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            borderRight: '1px solid var(--border-color)',
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
              padding: '8px 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddText}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Type size={16} style={{ marginRight: 6 }} /> Text
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddImage}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Upload size={16} style={{ marginRight: 6 }} /> Image
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => canvasRef.current?.addShape('rect')}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Square size={16} style={{ marginRight: 6 }} /> Rectangle
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => canvasRef.current?.addShape('circle')}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Circle size={16} style={{ marginRight: 6 }} /> Circle
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => canvasRef.current?.addShape('ellipse')}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Circle size={16} style={{ marginRight: 6 }} /> Ellipse
            </button>
            <span style={{ width: 1, height: 24, background: 'var(--border-color)', margin: '0 4px' }} />
            <a
              href={`/marketplace/configure?product=${product?.id}`}
              className="btn btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.9rem', textDecoration: 'none', color: 'inherit' }}
            >
              AI Assistant
            </a>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => canvasRef.current?.groupSelection()}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Group size={16} style={{ marginRight: 6 }} /> Group
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => canvasRef.current?.ungroupSelection()}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <Ungroup size={16} style={{ marginRight: 6 }} /> Ungroup
            </button>
          </div>

          {/* Canvas + Preview */}
          <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                background: 'var(--surface)',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
              }}
            >
              <DesignCanvas
                ref={canvasRef}
                width={400}
                height={400}
                productId={product.id}
                schema={schema}
              />
            </div>
            <div
              style={{
                width: 200,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Preview</p>
              <ProductPreviewPane canvasRef={canvasRef} width={180} height={180} />
            </div>
          </div>
        </div>

        {/* Right panel: Layers + Effects */}
        <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <LayerPanel />
          <EffectToolbar canvasRef={canvasRef} />
          <TypographyPanel canvasRef={canvasRef} />
          <ImageFiltersPanel canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}

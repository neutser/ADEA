/**
 * ProductBuilderPage — Admin create/edit product with zones.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_BASE } from '@/config';
import { ZoneEditor } from '@/components/admin/ZoneEditor';

export default function ProductBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      setProduct({
        id: '',
        name: '',
        category: 'crafts',
        description: '',
        hero_image: '',
        customization_schema: { surfaces: [{ id: 'front', label: 'Design Zone', zones: [{ id: 'main', x: '15%', y: '15%', w: '70%', h: '70%' }] }], fields: [], preview: { type: 'flat-artwork' } },
      });
      return;
    }
    fetch(`${API_BASE}/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product || d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isNew]);

  if (loading || !product) {
    return (
      <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const schema = (product.customization_schema as Record<string, unknown>) || {};
  const surfaces = (schema.surfaces as Array<Record<string, unknown>>) || [];

  return (
    <div style={{ padding: 24 }}>
      <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24 }}>
        {isNew ? 'New Product' : `Edit: ${String(product.name ?? '')}`}
      </h1>
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Product Name</label>
          <input
            type="text"
            className="input-field"
            value={String(product.name || '')}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Hero Image URL</label>
          <input
            type="text"
            className="input-field"
            value={String(product.hero_image || '')}
            onChange={(e) => setProduct({ ...product, hero_image: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>
        {!isNew && product.hero_image ? (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Zone Editor</h2>
            <ZoneEditor
              imageUrl={String(product.hero_image)}
              zones={surfaces[0]?.zones as Array<{ id: string; x: string; y: string; w: string; h: string }> || []}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

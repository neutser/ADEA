/**
 * ProductListPage — Admin list and manage marketplace products.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Package } from 'lucide-react';
import { API_BASE } from '@/config';

export default function ProductListPage() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; category: string; hero_image: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> New Product
        </Link>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              background: 'var(--surface)',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#333' }}>
              {p.hero_image && <img src={p.hero_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.category} • {p.id}</div>
            </div>
            <Link to={`/admin/products/${p.id}/edit`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Edit size={16} /> Edit
            </Link>
            <Link to={`/marketplace/design-studio?product=${p.id}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Package size={16} /> Design
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Upload, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

interface Asset {
  id: string;
  name: string;
  file_type: string;
  width?: number;
  height?: number;
  tags?: string[];
  created_at?: string;
}

const AssetLibrary = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login?redirect=/marketplace/assets');
      return;
    }
    fetch(`${API_BASE}/api/assets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setAssets(data.assets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, token, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !token) return;
    const file = files[0];
    const mime = file.type;
    if (!ALLOWED_MIME.includes(mime)) {
      setError('Invalid file type. Use JPEG, PNG, GIF, WebP, or SVG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.');
      return;
    }
    setError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      fetch(`${API_BASE}/api/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: file.name,
          fileData: base64 ? `data:${mime};base64,${base64}` : reader.result,
          fileType: mime,
          tags: [],
        }),
      })
        .then(r => {
          if (!r.ok) return r.json().then(d => { throw new Error(d.error || 'Upload failed'); });
          return r.json();
        })
        .then(() => {
          return fetch(`${API_BASE}/api/assets`, { headers: { Authorization: `Bearer ${token}` } });
        })
        .then(r => r.json())
        .then(data => {
          setAssets(data.assets || []);
          setUploading(false);
        })
        .catch(err => {
          setError(err.message || 'Upload failed');
          setUploading(false);
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const deleteAsset = (id: string) => {
    if (!token || !confirm('Delete this asset?')) return;
    fetch(`${API_BASE}/api/assets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.ok) setAssets(prev => prev.filter(a => a.id !== id));
      });
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="My Asset Library" description="Manage your uploaded images and artwork." />
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 8 }}>My Asset Library</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Upload and manage images for use in your designs. JPEG, PNG, GIF, WebP, SVG (max 10MB).</p>
          </motion.div>

          <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept={ALLOWED_MIME.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {error && <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>{error}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
            {assets.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div style={{ height: 140, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <AssetThumbnail assetId={a.id} fileType={a.file_type} />
                  <button onClick={() => deleteAsset(a.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.file_type} {a.width && a.height && `• ${a.width}×${a.height}`}</div>
                  {a.tags?.length ? (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {a.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: '0.7rem', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 6 }}><Tag size={10} style={{ verticalAlign: 'middle', marginRight: 2 }} />{t}</span>)}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          {assets.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <Image size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <h3 className="heading-md">No assets yet</h3>
              <p>Upload images to use in your designs.</p>
              <label className="btn btn-outline" style={{ marginTop: 16, cursor: 'pointer' }}>
                <Upload size={16} style={{ marginRight: 8 }} /> Upload Image
                <input type="file" accept={ALLOWED_MIME.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function AssetThumbnail({ assetId, fileType }: { assetId: string; fileType: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/assets/${assetId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const d = data.asset?.file_data;
        if (d) setSrc(d.startsWith('data:') ? d : `data:${fileType};base64,${d}`);
      });
  }, [assetId, fileType, token]);
  if (!src) return <Image size={40} color="var(--text-muted)" style={{ opacity: 0.5 }} />;
  return <img src={src} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
}

export default AssetLibrary;

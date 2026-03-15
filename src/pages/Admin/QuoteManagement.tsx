import React, { useEffect, useState } from 'react';
import { FileText, MessageSquare, Check, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface Quote {
  id: string;
  design_json: string;
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
}

const QuoteManagement: React.FC = () => {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/quotes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setQuotes(data.quotes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: editStatus, admin_response: editResponse }),
      });
      setEditingId(null);
      const res = await fetch(`${API_BASE}/api/quotes`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (q: Quote) => {
    setEditingId(q.id);
    setEditStatus(q.status);
    setEditResponse(q.admin_response || '');
  };

  const parseDesign = (json: string): any => {
    try {
      const d = JSON.parse(json);
      return { email: d.email, name: d.name, ...d };
    } catch {
      return {};
    }
  };

  const renderDesignSummary = (design: Record<string, unknown>) => {
    const mode = design.mode as string | undefined;
    const rows: { label: string; value: string | React.ReactNode }[] = [];
    if (design.name) rows.push({ label: 'Name', value: String(design.name) });
    if (design.email) rows.push({ label: 'Email', value: String(design.email) });
    if (design.businessName) rows.push({ label: 'Business', value: String(design.businessName) });
    if (design.referenceImage) rows.push({ label: 'Reference', value: <span style={{ color: 'var(--accent-neon-blue)' }}><ImageIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Image attached</span> });
    if (mode === 'sign') {
      if (design.text) rows.push({ label: 'Text', value: String(design.text) });
      if (design.widthCm) rows.push({ label: 'Width', value: `${design.widthCm} cm` });
      if (design.signMaterial) rows.push({ label: 'Material', value: String(design.signMaterial) });
      if (design.led && design.led !== 'none') rows.push({ label: 'LED', value: String(design.led) });
    } else if (mode === 'craft') {
      if (design.text) rows.push({ label: 'Text', value: String(design.text) });
      if (design.subtext) rows.push({ label: 'Subtext', value: String(design.subtext) });
      if (design.craftMaterial) rows.push({ label: 'Material', value: String(design.craftMaterial) });
      const shapeVal = design.shape;
      if (shapeVal) rows.push({ label: 'Shape', value: typeof shapeVal === 'object' && shapeVal && 'id' in shapeVal ? String((shapeVal as { id: string }).id) : String(shapeVal) });
    } else if (mode === 'apparel') {
      if (design.text) rows.push({ label: 'Text/Logo', value: String(design.text) });
      if (design.garment && typeof design.garment === 'object' && design.garment && 'name' in design.garment) rows.push({ label: 'Garment', value: String((design.garment as { name: string }).name) });
      if (design.apparelColor && typeof design.apparelColor === 'object' && design.apparelColor && 'name' in design.apparelColor) rows.push({ label: 'Color', value: String((design.apparelColor as { name: string }).name) });
      if (design.placement && typeof design.placement === 'object' && design.placement && 'name' in design.placement) rows.push({ label: 'Placement', value: String((design.placement as { name: string }).name) });
    }
    if (rows.length === 0) return null;
    return (
      <div style={{ display: 'grid', gap: '4px 16px', gridTemplateColumns: 'auto 1fr', fontSize: '0.85rem', padding: '12px 0' }}>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{r.label}:</span>
            <span style={{ color: 'var(--text-primary)' }}>{r.value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-lg">Quote Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review and respond to customer quote requests.</p>
        </div>

        <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['ID', 'Customer', 'Message', 'Status', 'Response', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                  ))}
                  <th style={{ padding: '14px 20px', width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => {
                  const design = parseDesign(q.design_json || '{}');
                  const isEditing = editingId === q.id;
                  return (
                    <React.Fragment key={q.id}>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--accent-neon-blue)', fontSize: '0.85rem' }}>{q.id}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 500 }}>{design.name || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{design.email || '—'}</div>
                      </td>
                      <td style={{ padding: '14px 20px', maxWidth: 200, fontSize: '0.85rem' }}>{q.message || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {isEditing ? (
                          <select className="input" value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ padding: '4px 8px', fontSize: '0.85rem' }}>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="sent">Sent</option>
                          </select>
                        ) : (
                          <span style={{ padding: '2px 10px', borderRadius: 12, background: q.status === 'accepted' ? 'rgba(0,255,136,0.15)' : q.status === 'rejected' ? 'rgba(255,68,68,0.15)' : 'rgba(255,153,0,0.15)', fontSize: '0.8rem', fontWeight: 600 }}>{q.status}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', maxWidth: 180, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {isEditing ? (
                          <textarea className="input" value={editResponse} onChange={e => setEditResponse(e.target.value)} rows={2} placeholder="Admin response..." style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem' }} />
                        ) : (
                          q.admin_response || '—'
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(q.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => handleSave(q.id)}><Check size={14}/> Save</button>
                            <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => setEditingId(null)}><X size={14}/> Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => startEdit(q)}>
                            <MessageSquare size={14}/> Edit
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                          aria-label={expandedId === q.id ? 'Collapse' : 'Expand design'}
                        >
                          {expandedId === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === q.id && (
                      <tr key={`${q.id}-exp`} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                        <td colSpan={8} style={{ padding: '0 20px 16px' }}>
                          <div style={{ borderLeft: '3px solid var(--accent-neon-blue)', paddingLeft: 16, marginTop: 8 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>Design details</div>
                            {renderDesignSummary(design) || (
                              <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: 200, margin: 0 }}>{q.design_json || '{}'}</pre>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {quotes.length === 0 && (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p>No quotes yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteManagement;

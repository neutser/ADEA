import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, Eye, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

const ClientDashboard: React.FC = () => {
  const { token } = useAuth();
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [bulkJobs, setBulkJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    
    fetch(`${API_BASE}/api/designs`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setSavedDesigns(data.designs || []))
      .catch(console.error);

    fetch(`${API_BASE}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setOrderHistory(data.orders || []))
      .catch(console.error);

    fetch(`${API_BASE}/api/bulk-jobs`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setBulkJobs(data.jobs || []))
      .catch(console.error);
  }, [token]);

  const downloadBulkFiles = async (jobId: string) => {
    if (!token) return;
    const res = await fetch(`${API_BASE}/api/bulk-jobs/${jobId}/files`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) { alert('Download failed'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-${jobId}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-lg">My Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Manage your designs, track orders, and download invoices.</p>
        </div>

        {/* Saved Designs */}
        <h2 className="heading-md" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={20} color="var(--accent-neon-blue)"/> Saved Designs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {savedDesigns.map(design => (
            <div key={design.id} className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '180px', background: `url(${design.config.logoFile || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80'}) center/cover` }}></div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>{design.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Product: {design.product_id}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Saved {new Date(design.created_at).toLocaleDateString()}</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to={`/marketplace/configure?share=${design.share_token}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', flex: 1, textAlign: 'center' }}>Edit Design</Link>
                </div>
              </div>
            </div>
          ))}
          {savedDesigns.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No saved designs found. Go create one!</p>}
        </div>

        {/* Bulk Jobs (C3) */}
        {bulkJobs.length > 0 && (
          <>
            <h2 className="heading-md" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} color="#00ff88"/> Bulk Jobs</h2>
            <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: '40px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Job</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Rows</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Date</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkJobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--accent-neon-blue)' }}>{job.id}</td>
                      <td style={{ padding: '14px 20px' }}>{job.total_rows || job.rows?.length || 0} rows</td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(job.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '4px' }} onClick={() => downloadBulkFiles(job.id)}>
                          <Download size={14}/> Download ZIP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Order History */}
        <h2 className="heading-md" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} color="var(--accent-neon-purple)"/> Order History</h2>
        <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Order', 'Product', 'Status', 'Date', 'Total', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--accent-neon-blue)' }}>{order.id}</td>
                  <td style={{ padding: '14px 20px' }}>{order.items?.length || 0} items</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {order.status === 'shipped' ? <CheckCircle2 size={14} color="#00ff88"/> : <Clock size={14} color="#ff9900"/>}
                      <span style={{ color: order.status === 'shipped' ? '#00ff88' : '#ff9900', fontWeight: 500, textTransform: 'capitalize' }}>{order.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '4px' }}><Download size={14}/> Invoice</button>
                    </div>
                  </td>
                </tr>
              ))}
              {orderHistory.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;

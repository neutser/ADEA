import React, { useEffect, useState } from 'react';
import { Package, Scissors, Zap, CheckCircle2, Truck, Eye, Box, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

const stages = [
  { id: 'received', label: 'Order Received', icon: <Package size={18}/>, color: '#00f0ff' },
  { id: 'design', label: 'Design Prep', icon: <Eye size={18}/>, color: '#b026ff' },
  { id: 'material', label: 'Material Selection', icon: <Box size={18}/>, color: '#ff9900' },
  { id: 'cutting', label: 'Laser Cutting', icon: <Zap size={18}/>, color: '#ff4444' },
  { id: 'engraving', label: 'Engraving', icon: <Scissors size={18}/>, color: '#ff6b6b' },
  { id: 'assembly', label: 'Assembly', icon: <Package size={18}/>, color: '#00ff88' },
  { id: 'qc', label: 'Quality Control', icon: <CheckCircle2 size={18}/>, color: '#00ccff' },
  { id: 'packaging', label: 'Packaging', icon: <Box size={18}/>, color: '#aaa' },
  { id: 'shipping', label: 'Shipping', icon: <Truck size={18}/>, color: '#00ff88' },
];

const ProductionPipeline: React.FC = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = () => {
    if (!token) return;
    fetch(`${API_BASE}/api/orders/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const updateStage = async (id: string, newStage: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStage })
      });
      fetchOrders();
    } catch(e) { console.error(e); }
  };

  const getStageIndex = (status: string) => stages.findIndex(s => s.id === status) || 0;

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '100%', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="heading-lg">Production Pipeline</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time manufacturing workflow for all active orders.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="card glass-panel" style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88' }}></span> Total Orders: <strong>{orders.length}</strong>
            </div>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="card glass-panel" style={{ padding: '20px 24px', marginBottom: '32px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '4px', minWidth: '900px' }}>
            {stages.map((s, i) => (
              <div key={s.id} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px', fontSize: '0.75rem', color: s.color, fontWeight: 600 }}>
                  {s.icon} {s.label}
                </div>
                <div style={{ height: '4px', background: `${s.color}33`, borderRadius: '2px', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${orders.length === 0 ? 0 : Math.max(20, (orders.filter(o => getStageIndex(o.status || 'received') >= i).length / orders.length) * 100)}%`, background: s.color, borderRadius: '2px', transition: 'width 0.3s' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{orders.filter(o => getStageIndex(o.status || 'received') === i).length} active</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const idx = getStageIndex(order.status || 'received');
            const isDone = idx === stages.length - 1;
            return (
              <div key={order.id} className="card glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1.5fr 1fr 120px 140px', gap: '24px', alignItems: 'center' }}>
                  
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-neon-blue)' }}>{order.id}</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{order.customer_name || 'Guest'}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>{order.items?.length} items <span style={{ color: 'var(--text-secondary)' }}>(${order.total.toFixed(2)})</span></p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {order.items?.map((item: any, i: number) => (
                        <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                           {item.name.substring(0, 30)}...
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Stage: <strong style={{ color: stages[idx].color }}>{stages[idx].label}</strong></p>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {stages.map((s, i) => (
                        <div key={s.id} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i <= idx ? s.color : 'var(--border-color)', transition: 'background 0.3s' }}></div>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {/* Placeholder for real machine assignment if we implement it */}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                     {!isDone && user?.role === 'admin' && (
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => updateStage(order.id, stages[idx + 1].id)}>
                           Next Stage <ArrowRight size={14}/>
                        </button>
                     )}
                     {isDone && <span style={{ color: '#00ff88', fontWeight: 600, fontSize: '0.9rem' }}>Completed ✓</span>}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductionPipeline;

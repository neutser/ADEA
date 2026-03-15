import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings, ShoppingBag, Zap, ArrowUpRight, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface AnalyticsSummary {
  totalEvents: number;
  pageViews: number;
  configStarts: number;
  cartAdds: number;
  topProducts: { product_id: string; c: number }[];
  recentEvents: any[];
  pageViewsChange?: number | null;
  configStartsChange?: number | null;
  cartAddsChange?: number | null;
}

interface Quote {
  id: string;
  user_id: string;
  design_json: string;
  message: string;
  status: string;
  admin_response?: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote editing state
  const [reviewQuote, setReviewQuote] = useState<Quote | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('approved');

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [analyticsRes, quotesRes] = await Promise.all([
        fetch(`${API_BASE}/api/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/quotes`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const analyticsData = await analyticsRes.json();
      const quotesData = await quotesRes.json();
      setSummary(analyticsData);
      setQuotes(quotesData.quotes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdateQuote = async () => {
    if (!reviewQuote || !token) return;
    try {
      await fetch(`${API_BASE}/api/quotes/${reviewQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: quoteStatus, admin_response: adminResponse })
      });
      setReviewQuote(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="section" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h2 className="heading-md" style={{ color: '#ff4444' }}>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  const formatChange = (v: number | null | undefined) => {
    if (v == null) return 'N/A';
    const s = v >= 0 ? `+${v}%` : `${v}%`;
    return s;
  };
  const stats = summary ? [
    { label: 'Total Page Views', value: summary.pageViews.toLocaleString(), change: formatChange(summary.pageViewsChange), icon: <ArrowUpRight size={24} color="#00ff88" /> },
    { label: 'Configurator Starts', value: summary.configStarts.toLocaleString(), change: formatChange(summary.configStartsChange), icon: <Settings size={24} color="var(--accent-neon-blue)" /> },
    { label: 'Add to Carts', value: summary.cartAdds.toLocaleString(), change: formatChange(summary.cartAddsChange), icon: <ShoppingBag size={24} color="var(--accent-neon-purple)" /> },
    { label: 'Pending Quotes', value: quotes.filter(q => q.status === 'pending').length.toString(), change: quotes.filter(q => q.status === 'pending').length > 0 ? 'Action Required' : 'All clear', icon: <Clock size={24} color="#ff9900" /> },
  ] : [];

  return (
    <div className="section" style={{ paddingTop: '40px', background: 'var(--bg-color)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '100%', padding: '0 40px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="heading-lg">Enterprise Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Full overview of sales, manufacturing, and analytics.</p>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }} onClick={fetchData}>
             <Zap size={20} /> Refresh Data
          </button>
        </div>

        {/* Dashboard Navigation */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', borderBottom: '1px solid var(--border-color)' }}>
          {['Overview', 'Quotes', 'Sales Analytics', 'Production Reports'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
              style={{ 
                color: activeTab === tab.toLowerCase().split(' ')[0] ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.toLowerCase().split(' ')[0] ? 600 : 400,
                borderBottom: activeTab === tab.toLowerCase().split(' ')[0] ? '2px solid var(--accent-neon-blue)' : '2px solid transparent',
                paddingBottom: '12px',
                marginBottom: '-1px',
                transition: 'all 0.2s',
                fontSize: '1rem',
                position: 'relative',
              }}
            >
              {tab}
              {tab === 'Quotes' && quotes.filter(q => q.status === 'pending').length > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#ff4444', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>
                  {quotes.filter(q => q.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading enterprise data...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="fade-in">
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                  {stats.map((stat, i) => (
                    <div key={i} className="card glass-panel" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</p>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{stat.icon}</div>
                      </div>
                      <h3 className="heading-lg" style={{ marginBottom: '8px', fontSize: '2rem' }}>{stat.value}</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <TrendingUp size={16} color={stat.change.startsWith('+') || stat.change === 'All clear' ? '#00ff88' : stat.change === 'N/A' ? 'var(--text-muted)' : '#ff9900'} />
                         <span style={{ color: stat.change.startsWith('+') || stat.change === 'All clear' ? '#00ff88' : stat.change === 'N/A' ? 'var(--text-muted)' : '#ff9900', fontSize: '0.85rem' }}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                  
                  {/* Top Products */}
                  <div className="card glass-panel" style={{ padding: '30px' }}>
                    <h3 className="heading-md" style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Top Configured Products</h3>
                    {summary?.topProducts.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>No analytics data available yet.</p>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {summary?.topProducts.map((p, i) => (
                          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                            <span>{p.product_id}</span>
                            <span style={{ color: 'var(--accent-neon-blue)', fontWeight: 600 }}>{p.c} events</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Recent Events Log */}
                  <div className="card glass-panel" style={{ padding: '30px' }}>
                    <h3 className="heading-md" style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Recent Activity Feed</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                      {summary?.recentEvents.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No activity yet.</p>
                      ) : (
                        summary?.recentEvents.slice(0, 10).map((ev: any, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                             <span style={{ color: 'var(--text-primary)' }}>{ev.event}</span>
                             <span style={{ color: 'var(--text-secondary)' }}>{new Date(ev.created_at).toLocaleTimeString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="fade-in">
                {reviewQuote ? (
                  <div className="card glass-panel" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3 className="heading-md">Review Quote: {reviewQuote.id}</h3>
                      <button className="btn btn-outline" onClick={() => setReviewQuote(null)}>Back to List</button>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
                      <p style={{ marginBottom: '12px' }}><strong>Customer Message:</strong> {reviewQuote.message || 'No message provided.'}</p>
                      <details>
                        <summary style={{ cursor: 'pointer', color: 'var(--accent-neon-blue)' }}>View Design Payload</summary>
                        <pre style={{ marginTop: '12px', background: '#000', padding: '16px', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto' }}>
                          {JSON.stringify(JSON.parse(reviewQuote.design_json || '{}'), null, 2)}
                        </pre>
                      </details>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '8px' }}>Update Status</label>
                      <select className="input" value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width: '100%', marginBottom: '16px' }}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved & Priced</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed / Ordered</option>
                      </select>

                      <label style={{ display: 'block', marginBottom: '8px' }}>Admin Response / Price Quote</label>
                      <textarea 
                        className="input" 
                        rows={4} 
                        value={adminResponse} 
                        onChange={(e) => setAdminResponse(e.target.value)}
                        placeholder="e.g. We can do this for $150. Attached is the payment link."
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>
                    
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleUpdateQuote}>
                      Update Quote & Notify Customer
                    </button>
                  </div>
                ) : (
                  <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                          {['Quote ID', 'Date', 'Status', 'Message Snippet', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.length === 0 ? (
                          <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No quote requests found.</td></tr>
                        ) : (
                          quotes.map((quote) => (
                            <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '14px 20px', fontWeight: 500, fontFamily: 'monospace' }}>{quote.id}</td>
                              <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {new Date(quote.created_at).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                <span style={{ 
                                  padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                  background: quote.status === 'pending' ? '#ff990022' : quote.status === 'approved' ? '#00ff8822' : 'rgba(255,255,255,0.1)',
                                  color: quote.status === 'pending' ? '#ff9900' : quote.status === 'approved' ? '#00ff88' : '#fff'
                                }}>
                                  {quote.status.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {quote.message || 'No message'}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => {
                                  setReviewQuote(quote);
                                  setQuoteStatus(quote.status);
                                  setAdminResponse(quote.admin_response || '');
                                }}>
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

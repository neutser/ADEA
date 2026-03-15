import React from 'react';
import { Mail, Clock, CheckCircle } from 'lucide-react';

const KanbanBoard: React.FC = () => {
  const columns = [
    { id: 'new', title: 'New Leads', color: 'var(--text-secondary)' },
    { id: 'contacted', title: 'Outreach Sent', color: 'var(--accent-neon-blue)' },
    { id: 'interested', title: 'Interested', color: '#ff9900' },
    { id: 'quote', title: 'Quote Sent', color: '#b026ff' },
    { id: 'won', title: 'Order Confirmed', color: '#00ff88' },
  ];

  const cards = [
    { id: 1, col: 'new', name: 'The Modern Barber', status: 'Requires Mockup' },
    { id: 2, col: 'new', name: 'Glow Beauty Lounge', status: 'New Registration' },
    { id: 3, col: 'contacted', name: 'TechHub Coworking', status: 'Emailed 2d ago', autoSent: true },
    { id: 4, col: 'interested', name: 'Café Luz', status: 'Replied yesterday' },
    { id: 5, col: 'quote', name: 'Alpine Crossfit', status: 'Quote: $1,250' },
  ];

  return (
    <div className="section" style={{ minHeight: '80vh', paddingBottom: '0' }}>
      <div className="container" style={{ maxWidth: '100%', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="heading-lg">Lead CRM Pipeline</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your automated outreach and B2B pipeline.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Mail size={18}/> Bulk Outreach</button>
            <button className="btn btn-primary">+ Add Manual Lead</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '40px', minHeight: '600px' }}>
          {columns.map(col => (
            <div key={col.id} style={{ flex: '0 0 320px', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${col.color}`, paddingBottom: '12px' }}>
                 <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{col.title}</h3>
                 <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                   {cards.filter(c => c.col === col.id).length}
                 </span>
              </div>

              {cards.filter(c => c.col === col.id).map(card => (
                <div key={card.id} className="card glass-panel" style={{ padding: '16px', cursor: 'pointer' }}>
                   <h4 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.05rem' }}>{card.name}</h4>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {card.col === 'new' ? <Clock size={14} /> : <CheckCircle size={14} color={col.color} />}
                      {card.status}
                   </div>
                   {card.autoSent && (
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-neon-blue)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        <Mail size={12} /> Auto-Mockup Sent
                     </div>
                   )}
                </div>
              ))}
              
              <button style={{ width: '100%', padding: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                + Add Card
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

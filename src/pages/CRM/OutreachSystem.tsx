import React, { useState } from 'react';
import { Send, Image as ImageIcon, CheckCircle, BarChart3, Users } from 'lucide-react';

const OutreachSystem: React.FC = () => {
  const [subject, setSubject] = useState("Interior Logo Sign Concept for Your Business");
  const [message, setMessage] = useState("Hello,\n\nWe specialize in custom 3D logo signs for offices and retail spaces.\nWe created a visual concept showing how your logo could look as a modern wall sign.\n\nLet me know if you'd like to discuss bringing this to life for your space!\n\nBest,\nThe Adea Crafts Team");

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
             <h1 className="heading-lg">Automated Outreach Engine</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Send personalized mockup proposals to your CRM leads.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
             <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', padding: '10px 16px' }}>
                <Users size={18} /> Audience: 45 Leads
             </button>
          </div>
        </div>

        {/* Campaign Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
           <div className="card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                 <Send size={20} /> <span style={{ fontWeight: 500 }}>Emails Sent</span>
              </div>
              <h3 className="heading-lg">1,204</h3>
           </div>
           <div className="card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--accent-neon-blue)' }}>
                 <BarChart3 size={20} /> <span style={{ fontWeight: 500 }}>Open Rate</span>
              </div>
              <h3 className="heading-lg">68.4%</h3>
           </div>
           <div className="card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#00ff88' }}>
                 <CheckCircle size={20} /> <span style={{ fontWeight: 500 }}>Reply Rate</span>
              </div>
              <h3 className="heading-lg">12.1%</h3>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          
          {/* Email Composer */}
          <div className="card glass-panel slide-up">
            <h3 className="heading-md" style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Campaign Template</h3>
            
            <div className="input-group">
              <label className="input-label">Subject Line</label>
              <input 
                type="text" 
                className="input-field" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
               <label className="input-label">Message Body</label>
               <textarea 
                 className="input-field" 
                 rows={8}
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 style={{ resize: 'vertical' }}
               />
            </div>

            <div style={{ padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-neon-blue)', background: 'rgba(0, 240, 255, 0.05)' }}>
               <ImageIcon size={20} />
               <span style={{ fontWeight: 500 }}>[Dynamic Auto-Generated Mockup Image Inserted Here]</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Variables: {"{business_name}"}, {"{city}"}</p>
               <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                  <Send size={18} /> Launch Campaign
               </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
             <h3 className="heading-md" style={{ marginBottom: '24px', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Live Preview (Recipient View)</h3>
             <div className="card" style={{ background: '#fff', color: '#111', padding: '0', overflow: 'hidden' }}>
                <div style={{ background: '#f5f5f5', padding: '16px', borderBottom: '1px solid #ddd' }}>
                   <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>To: hello@modernbarber.ch</p>
                   <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '1rem' }}>{subject}</p>
                </div>
                <div style={{ padding: '24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                   <p style={{ whiteSpace: 'pre-wrap' }}>{message.replace('business', 'Modern Barber')}</p>
                   
                   <div style={{ marginTop: '24px', position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', background: '#222' }}>
                      {/* Simulated auto-generated mockup inserted into the email preview */}
                      <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80" alt="Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <h3 style={{ color: '#fff', fontSize: '2rem', textShadow: '0 0 20px #b026ff, 0 0 10px #b026ff', letterSpacing: '4px', fontFamily: '"Outfit", sans-serif' }}>THE MODERN BARBER</h3>
                      </div>
                   </div>

                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OutreachSystem;

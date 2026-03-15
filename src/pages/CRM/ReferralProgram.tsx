import React from 'react';
import { Gift, Copy, Share2, Users } from 'lucide-react';

const ReferralProgram: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--accent-neon-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-neon-purple)' }} className="neon-box-purple">
             <Gift size={40} />
           </div>
           <h1 className="heading-xl" style={{ marginBottom: '16px' }}>Client Referral Program</h1>
           <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Invite other businesses to build their custom signage with Adea Crafts and you both receive exclusive rewards.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '60px' }}>
           <div className="card glass-panel slide-up" style={{ padding: '32px', textAlign: 'center' }}>
             <h3 className="heading-md" style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px' }}>They Get</h3>
             <h2 className="heading-xl" style={{ marginBottom: '16px' }}>15% OFF</h2>
             <p style={{ color: 'var(--text-secondary)' }}>Their first custom signage order (minimum $500 value).</p>
           </div>
           
           <div className="card glass-panel slide-up" style={{ padding: '32px', textAlign: 'center', animationDelay: '0.1s' }}>
             <h3 className="heading-md" style={{ color: 'var(--accent-neon-purple)', marginBottom: '16px' }}>You Get</h3>
             <h2 className="heading-xl" style={{ marginBottom: '16px' }}>$100 Cash</h2>
             <p style={{ color: 'var(--text-secondary)' }}>Or a $150 credit towards your next interior branding project.</p>
           </div>
        </div>

        <div className="card glass-panel slide-up" style={{ padding: '40px', animationDelay: '0.2s' }}>
           <h3 className="heading-md" style={{ marginBottom: '24px' }}>Your Unique Referral Link</h3>
           
           <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
             <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
               <input type="text" className="input-field" readOnly value="https://adeacrafts.com/invite/modern-barber-89" style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }} />
             </div>
             <button className="btn btn-primary" style={{ padding: '0 24px', display: 'flex', gap: '8px' }}>
               <Copy size={18} /> Copy
             </button>
             <button className="btn btn-outline" style={{ padding: '0 24px', display: 'flex', gap: '8px' }}>
               <Share2 size={18} /> Share
             </button>
           </div>

           <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h4 className="heading-md" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} color="var(--accent-neon-blue)"/> Your Referrals</h4>
                 <span style={{ fontWeight: 600 }}>Total Earned: $200</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                   <div>
                     <p style={{ fontWeight: 600, marginBottom: '4px' }}>The Rustic Grill</p>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed Order on Oct 12</p>
                   </div>
                   <div style={{ color: '#00ff88', fontWeight: 600, display: 'flex', alignItems: 'center' }}>+$100 Paid</div>
                 </div>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                   <div>
                     <p style={{ fontWeight: 600, marginBottom: '4px' }}>Glow Beauty Lounge</p>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quote Sent (Pending Review)</p>
                   </div>
                   <div style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>Pending</div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default ReferralProgram;

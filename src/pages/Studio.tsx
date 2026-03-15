import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Scissors, Layers, PenTool } from 'lucide-react';

const Studio: React.FC = () => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        height: '80vh', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.95)), url("https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1600") center/cover',
        textAlign: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container slide-up" style={{ maxWidth: '900px' }}>
           <span style={{ 
             display: 'inline-block',
             padding: '8px 16px', 
             background: 'rgba(0,255,136,0.15)', 
             color: '#00ff88', 
             borderRadius: '20px', 
             fontSize: '0.9rem', 
             fontWeight: 600,
             marginBottom: '24px',
             border: '1px solid rgba(0,255,136,0.3)'
           }}>
             Precision Manufacturing Lab
           </span>
           <h1 className="heading-xl" style={{ marginBottom: '24px' }}>Adea Maker Studio</h1>
           <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
             Powered by the xTool P2S CO2 Laser and the Silhouette Curio 2 Flatbed. We fabricate premium leather goods, etched metal cards, foiled stationery, and bespoke art.
           </p>
           <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
             <a href="#xtool" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>xTool Products</a>
             <a href="#curio" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Curio 2 Flatbed</a>
           </div>
        </div>
      </section>

      {/* xTool P2S Section */}
      <section id="xtool" className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '60px', alignItems: 'center' }}>
            
            <div className="slide-right">
              <Cpu size={48} color="var(--accent-neon-blue)" style={{ marginBottom: '24px' }} />
              <h2 className="heading-lg" style={{ marginBottom: '16px' }}>xTool P2S CO2 Laser</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Our 55W CO2 laser cutter handles deep, precise cuts and high-speed multi-pass engraving on thick materials, leather, and glass.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-primary)' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><Scissors size={18} color="var(--accent-neon-blue)"/> Genuine Leather Engraving</li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><Scissors size={18} color="var(--accent-neon-blue)"/> Custom Rubber Logo Stamps</li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><Scissors size={18} color="var(--accent-neon-blue)"/> Multi-layered Wooden Art</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Scissors size={18} color="var(--accent-neon-blue)"/> Rotary Glass Engraving</li>
              </ul>
            </div>

            <div className="slide-left" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <Link to="/shop/personalized-gifts" className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                 <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1481358509831-2fb0705a61d1?q=80&w=400") center/cover' }}></div>
                 <div style={{ padding: '20px' }}>
                   <h3 className="heading-md">Engraved Leather & Gifts</h3>
                   <div style={{ color: 'var(--accent-neon-blue)', fontSize: '0.9rem', marginTop: '8px' }}>Shop Products &rarr;</div>
                 </div>
               </Link>
               <Link to="/shop/personalized-gifts" className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                 <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=400") center/cover' }}></div>
                 <div style={{ padding: '20px' }}>
                   <h3 className="heading-md">Custom Stamps & Plaques</h3>
                   <div style={{ color: 'var(--accent-neon-blue)', fontSize: '0.9rem', marginTop: '8px' }}>Shop Products &rarr;</div>
                 </div>
               </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Silhouette Curio 2 Section */}
      <section id="curio" className="section bg-elevated">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr minmax(300px, 1fr)', gap: '60px', alignItems: 'center' }}>
            
            <div className="slide-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <Link to="/shop/personalized-gifts" className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                 <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1562016556-912b7d2bf6cd?q=80&w=400") center/cover' }}></div>
                 <div style={{ padding: '20px' }}>
                   <h3 className="heading-md">Etched Metal & Wallet Cards</h3>
                   <div style={{ color: 'var(--accent-neon-purple)', fontSize: '0.9rem', marginTop: '8px' }}>Shop Products &rarr;</div>
                 </div>
               </Link>
               <Link to="/shop/wedding" className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                 <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1563503541575-cf60b134d1dd?q=80&w=400") center/cover' }}></div>
                 <div style={{ padding: '20px' }}>
                   <h3 className="heading-md">Foiled Stationery & Invites</h3>
                   <div style={{ color: 'var(--accent-neon-purple)', fontSize: '0.9rem', marginTop: '8px' }}>Shop Products &rarr;</div>
                 </div>
               </Link>
            </div>

            <div className="slide-left">
              <Layers size={48} color="var(--accent-neon-purple)" style={{ marginBottom: '24px' }} />
              <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Silhouette Curio 2</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                A specialized flatbed machine using a 20mm clearance for complex tooling: metal etching, gold foil stamping, leather punching, and embossing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-primary)' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><PenTool size={18} color="var(--accent-neon-purple)"/> Aluminum & Brass Etching</li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><PenTool size={18} color="var(--accent-neon-purple)"/> Heat Foiled Invitations</li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><PenTool size={18} color="var(--accent-neon-purple)"/> Debossed Leather & Paper</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><PenTool size={18} color="var(--accent-neon-purple)"/> Stippled Metal Photo Art</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Universal CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
         <div className="container" style={{ maxWidth: '600px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '24px' }}>Want to prototype a product?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
               Our engineering team can utilize both machines to create mixed-media prototypes for your brand or event.
            </p>
            <Link to="/quote" className="btn btn-primary" style={{ padding: '16px 32px' }}>Discuss Your Project</Link>
         </div>
      </section>

    </div>
  );
};

export default Studio;

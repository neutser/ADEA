import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ShieldCheck, Zap } from 'lucide-react';

const categories = [
  { id: 'keychains', name: 'Personalized Keychains', img: 'https://images.unsplash.com/photo-1584883907797-17ed40590a36?q=80&w=400', desc: 'Engraved wood and acrylic tags for everyday carry.', link: '/shop/keychains' },
  { id: 'wedding', name: 'Wedding Favors', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400', desc: 'Bulk guest tags, place cards, and save-the-dates.', link: '/shop/wedding' },
  { id: 'pets', name: 'Pet Products', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400', desc: 'Custom dog tags and pet memory plaques.', link: '/shop/pet-products' },
  { id: 'phone-stands', name: 'Desk Accessories', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400', desc: 'Laser-cut wood phone stands and pen holders.', link: '/shop/personalized-gifts' },
  { id: 'coasters', name: 'Custom Coasters', img: 'https://images.unsplash.com/photo-1614088829871-31644e590740?q=80&w=400', desc: 'Engraved family name or logo drink coasters.', link: '/shop/personalized-gifts' },
  { id: 'decor', name: 'Wall Decor', img: 'https://images.unsplash.com/photo-1583847268964-b28e5451e5af?q=80&w=400', desc: 'Layered family name signs and nursery decor.', link: '/shop/home-decor' },
];

const CraftsHome: React.FC = () => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        height: '60vh', 
        minHeight: '500px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600") center/cover',
        textAlign: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container slide-up" style={{ maxWidth: '800px' }}>
           <span style={{ 
             display: 'inline-block',
             padding: '8px 16px', 
             background: 'rgba(255,153,0,0.2)', 
             color: '#ff9900', 
             borderRadius: '20px', 
             fontSize: '0.9rem', 
             fontWeight: 600,
             marginBottom: '24px'
           }}>
             Adea Maker Studio – Direct to Consumer
           </span>
           <h1 className="heading-xl" style={{ marginBottom: '24px' }}>Custom Gifts & Crafts,<br/>Made Just For You.</h1>
           <p style={{ fontSize: '1.2rem', color: '#ddd', marginBottom: '40px' }}>
             From personalized wooden keychains to elegant wedding favors. Design online in seconds, shipped from our laser studio in 48 hours.
           </p>
           <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
             <Link to="/crafts/configurator" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Start Designing</Link>
             <a href="#categories" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Browse Gallery</a>
           </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section bg-elevated">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-neon-blue)' }}>
                   <Zap size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>Real-time Preview</h3>
                <p style={{ color: 'var(--text-secondary)' }}>See exactly how your engraving will look before you order with our live configurator.</p>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255, 153, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ff9900' }}>
                   <Gift size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>Bulk Discounts</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Ordering for a wedding or corporate event? Save up to 20% applied automatically at checkout.</p>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00ff88' }}>
                   <ShieldCheck size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>Studio Quality</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Every item is precision cut using our professional-grade xTool and Silhouette lasers.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="heading-lg">Shop by Category</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find the perfect personalized item.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {categories.map(cat => (
              <Link to={cat.link} key={cat.id} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', transition: 'all 0.3s' }}>
                <div style={{ height: '220px', background: `url(${cat.img}) center/cover`, borderBottom: '1px solid var(--border-color)' }}></div>
                <div style={{ padding: '24px' }}>
                  <h3 className="heading-md" style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{cat.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{cat.desc}</p>
                  <span style={{ color: 'var(--accent-neon-blue)', fontWeight: 600, fontSize: '0.85rem' }}>Customize Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Upsell Banner */}
      <section className="container">
        <div style={{ 
          background: 'linear-gradient(45deg, rgba(176,38,255,0.1), rgba(0,240,255,0.1))', 
          border: '1px solid var(--accent-neon-blue)',
          borderRadius: '16px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h2 className="heading-md" style={{ marginBottom: '8px' }}>Want to sell our products?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>We offer white-label drop shipping and wholesale accounts for Etsy and Shopify sellers. Let us handle the manufacturing.</p>
          </div>
          <Link to="/quote" className="btn btn-primary" style={{ padding: '12px 24px' }}>Partner With Us</Link>
        </div>
      </section>

    </div>
  );
};

export default CraftsHome;

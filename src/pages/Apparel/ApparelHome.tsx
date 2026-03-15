import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Shirt, PenTool, CheckCircle, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'polos', name: 'Embroidered Polos', img: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=400', desc: 'Premium cotton blend polos for corporate teams and events.' },
  { id: 'hoodies', name: 'Custom Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400', desc: 'Heavyweight hoodies with DTF print or embroidery.' },
  { id: 'aprons', name: 'Workwear Aprons', img: 'https://images.unsplash.com/photo-1576613317805-3e284b395dae?q=80&w=400', desc: 'Heavy-duty canvas aprons for cafes, salons, and workshops.' },
  { id: 'caps', name: 'Headwear', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400', desc: 'Classic baseball caps and beanies with 3D puff embroidery.' },
  { id: 'totes', name: 'Tote Bags', img: 'https://images.unsplash.com/photo-1597423233866-5b430e32609d?q=80&w=400', desc: 'Eco-friendly canvas bags for retail and events.' },
  { id: 'uniforms', name: 'Company Uniforms', img: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=400', desc: 'Full-service workwear catalog for construction and medical.' },
];

const ApparelHome: React.FC = () => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        height: '70vh', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1618331835717-814cb2632bca?q=80&w=1600") center/cover',
        textAlign: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container slide-up" style={{ maxWidth: '900px' }}>
           <span style={{ 
             display: 'inline-block',
             padding: '8px 16px', 
             background: 'rgba(176,38,255,0.2)', 
             color: 'var(--accent-neon-purple)', 
             borderRadius: '20px', 
             fontSize: '0.9rem', 
             fontWeight: 600,
             marginBottom: '24px'
           }}>
             Adea Apparel Manufacturing
           </span>
           <h1 className="heading-xl" style={{ marginBottom: '24px' }}>Custom Workwear &<br/>Embroidered Apparel.</h1>
           <p style={{ fontSize: '1.2rem', color: '#ddd', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
             Elevate your brand with premium embroidered polos, DTF printed hoodies, and heavy-duty workwear aprons. Produced in-house.
           </p>
           <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
             <Link to="/apparel/configurator" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Design Online</Link>
             <a href="#categories" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>View Catalog</a>
           </div>
        </div>
      </section>

      {/* Process/Value Section */}
      <section className="section bg-elevated">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-neon-blue)' }}>
                   <PenTool size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>Free Logo Digitization</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Upload your logo and our team will convert it into a production-ready embroidery file for free.</p>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(176, 38, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-neon-purple)' }}>
                   <Shirt size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>Premium Garments</h3>
                <p style={{ color: 'var(--text-secondary)' }}>We source from top brands including AS Colour, Carhartt, and Nike to ensure maximum quality.</p>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00ff88' }}>
                   <Scissors size={30} />
                </div>
                <h3 className="heading-md" style={{ marginBottom: '8px' }}>No Minimums</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Order a single prototype hoodie or 500 employee polo shirts. Our pricing scales with your needs.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="heading-lg">Apparel Catalog</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a garment to start customizing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {categories.map(cat => (
              <Link to="/apparel/configurator" key={cat.id} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '260px', background: `url(${cat.img}) center/cover`, borderBottom: '1px solid var(--border-color)' }}></div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                     <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                     <ArrowRight size={18} color="var(--accent-neon-blue)" />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Corporate Banner */}
      <section className="container" style={{ marginTop: '20px' }}>
        <div style={{ 
          background: 'var(--bg-elevated)', 
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h2 className="heading-md" style={{ marginBottom: '12px' }}>Outfit Your Entire Team</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#00ff88"/> Free bulk digital mockups</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#00ff88"/> Dedicated account manager</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#00ff88"/> Custom neck tags & branding</div>
            </div>
          </div>
          <Link to="/quote" className="btn btn-primary" style={{ padding: '12px 24px', background: 'var(--accent-neon-purple)', borderColor: 'var(--accent-neon-purple)' }}>Contact Corporate Sales</Link>
        </div>
      </section>

    </div>
  );
};

export default ApparelHome;

import React from 'react';
import { Link } from 'react-router-dom';

const BusinessSolutions: React.FC = () => {
  return (
    <div className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="heading-lg" style={{ marginBottom: '20px' }}>Business Solutions</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 60px' }}>We offer complete interior branding packages for offices, retail stores, and restaurants.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'left' }}>
           <div className="card glass-panel">
              <h3 className="heading-md" style={{ marginBottom: '16px' }}>Office Starter Package</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Reception logo sign, 5 door signs, and directional signage.</p>
              <p className="text-lg" style={{ fontWeight: 'bold', marginBottom: '24px' }}>Estimated: $800 - $1,500</p>
              <Link to="/quote" className="btn btn-outline" style={{ width: '100%' }}>Request Quote</Link>
           </div>
           
           <div className="card" style={{ border: '1px solid var(--accent-neon-blue)' }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '8px', textAlign: 'center', marginBottom: '16px', borderRadius: '4px', color: 'var(--accent-neon-blue)', fontWeight: 'bold' }}>Most Popular</div>
              <h3 className="heading-md" style={{ marginBottom: '16px' }}>Retail & Restaurant Branding</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Large LED wall sign, Window decals, Custom menu board or directional signs.</p>
              <p className="text-lg" style={{ fontWeight: 'bold', marginBottom: '24px' }}>Estimated: $1,500 - $3,000</p>
              <Link to="/quote" className="btn btn-primary" style={{ width: '100%' }}>Request Quote</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSolutions;

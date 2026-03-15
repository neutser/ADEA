import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  const [params] = useSearchParams();
  const orderId = params.get('order_id') || '';

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card glass-panel fade-in" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <CheckCircle size={64} color="#00ff88" style={{ margin: '0 auto 24px' }} className="neon-text-blue" />
        <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Payment Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Thank you for your order. Your payment has been processed. Our design team will begin preparing your items shortly.
        </p>
        {orderId && (
          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', marginBottom: '32px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order Number</p>
            <p className="heading-md" style={{ color: 'var(--accent-neon-blue)' }}>#{orderId}</p>
          </div>
        )}
        <Link to="/" className="btn btn-outline" style={{ width: '100%' }}>Return Home</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

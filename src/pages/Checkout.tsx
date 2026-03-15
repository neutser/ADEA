import React, { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ id: '' });
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '' });

  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items, total: grandTotal, shipping: formData })
      });
      const data = await res.json();
      if (data.useFallback || !data.url) {
        const orderRes = await fetch(`${API_BASE}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ items, total: grandTotal, shipping: formData })
        });
        if (!orderRes.ok) throw new Error('Order failed');
        const orderData = await orderRes.json();
        setOrderInfo({ id: orderData.orderId });
        clearCart();
        setComplete(true);
      } else {
        clearCart();
        window.location.href = data.url;
        return;
      }
    } catch (e) {
      console.error(e);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !complete) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card glass-panel" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add items from our configurators or shop to checkout.</p>
          <Link to="/cart" className="btn btn-outline" style={{ marginRight: '12px' }}>View Cart</Link>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card glass-panel fade-in" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle size={64} color="#00ff88" style={{ margin: '0 auto 24px' }} className="neon-text-blue" />
          <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Thank you for your order. We have sent a confirmation email to you. Our design team will begin preparing your sign shortly.</p>
          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', marginBottom: '32px' }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order Number</p>
             <p className="heading-md" style={{ color: 'var(--accent-neon-blue)' }}>#{orderInfo.id}</p>
          </div>
          <Link to="/" className="btn btn-outline" style={{ width: '100%' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap-reverse' }}>
          
          <div style={{ flex: '1 1 500px' }} className="slide-up">
            <h2 className="heading-lg" style={{ marginBottom: '32px' }}>Checkout</h2>
            
            <form className="card glass-panel" onSubmit={handleSubmit}>
               
               <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Shipping Information</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div className="input-group">
                   <label className="input-label">First Name</label>
                   <input type="text" className="input-field" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Last Name</label>
                   <input type="text" className="input-field" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                 </div>
               </div>
               <div className="input-group">
                 <label className="input-label">Address</label>
                 <input type="text" className="input-field" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                 <div className="input-group">
                   <label className="input-label">City</label>
                   <input type="text" className="input-field" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Zip Code</label>
                   <input type="text" className="input-field" required value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                 </div>
               </div>

               <h3 className="heading-md" style={{ fontSize: '1.25rem', marginTop: '40px', marginBottom: '20px' }}>Payment Details</h3>
               <div className="input-group">
                 <label className="input-label">Card Number</label>
                 <div style={{ position: 'relative' }}>
                   <input type="text" className="input-field" placeholder="0000 0000 0000 0000" required style={{ paddingLeft: '44px' }} />
                   <CreditCard size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                 </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div className="input-group">
                   <label className="input-label">Expiry (MM/YY)</label>
                   <input type="text" className="input-field" placeholder="MM/YY" required />
                 </div>
                 <div className="input-group">
                   <label className="input-label">CVC</label>
                   <input type="text" className="input-field" placeholder="123" required />
                 </div>
               </div>

               <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '32px', padding: '16px' }} disabled={isSubmitting}>
                 {isSubmitting ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
               </button>
            </form>
          </div>

          <div style={{ flex: '1 1 350px' }} className="slide-up">
            <div className="card" style={{ position: 'sticky', top: '100px', background: 'var(--bg-elevated)', border: 'none' }}>
              <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Order Summary</h3>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '4px', background: item.image ? `url(${item.image}) center/cover` : 'var(--border-color)', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ fontWeight: 600, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
                <span className="heading-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

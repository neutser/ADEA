import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, Gift, Info } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils';

const Cart: React.FC = () => {
  const [giftMode, setGiftMode] = useState(false);
  const { items, removeItem, itemCount, total } = useCart();

  const giftFee = 15;
  const displayTotal = total + (giftMode ? giftFee : 0);

  if (itemCount === 0) {
    return (
      <div className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 className="heading-lg" style={{ marginBottom: '24px' }}>Your Cart</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Your cart is empty. Browse our shop to find something you love.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 className="heading-lg" style={{ marginBottom: '40px' }}>Your Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {items.map((item) => (
              <div key={item.id} className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '24px',
                    alignItems: 'center',
                    gap: '24px',
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 8,
                      background: item.image
                        ? `var(--bg-elevated) url("${item.image}") center/cover`
                        : 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {!item.image && 'IMG'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>
                        {item.name}
                      </h3>
                      <p className="heading-md" style={{ fontSize: '1.25rem' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    {item.options && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                        {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                      Qty: {item.quantity}
                    </p>
                    <button
                      type="button"
                      style={{
                        color: '#ff4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                      }}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Gift Mode Upsell */}
            <div
              className="card"
              style={{
                padding: '24px',
                border: giftMode ? '2px solid var(--accent-neon-purple)' : '1px solid var(--border-color)',
                background: giftMode ? 'rgba(176,38,255,0.05)' : 'var(--bg-elevated)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onClick={() => setGiftMode(!giftMode)}
              onKeyDown={(e) => e.key === 'Enter' && setGiftMode((g) => !g)}
              role="button"
              tabIndex={0}
              aria-pressed={giftMode}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: giftMode ? '#b026ff' : 'var(--bg-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: giftMode ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <Gift size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Premium Gift Packaging</h3>
                    <span style={{ fontWeight: 600 }}>+{formatPrice(giftFee)}</span>
                  </div>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      marginBottom: giftMode ? '16px' : 0,
                    }}
                  >
                    Include a luxury unboxing experience, velvet pouches for small items, and a
                    handwritten personalized note. No invoices included.
                  </p>
                  {giftMode && (
                    <div className="fade-in" onClick={(e) => e.stopPropagation()}>
                      <label htmlFor="gift-message" className="input-label">
                        Gift message (optional)
                      </label>
                      <textarea
                        id="gift-message"
                        className="input-field"
                        placeholder="Enter your gift message here..."
                        rows={3}
                        style={{ background: 'var(--bg-color)', marginTop: 8 }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: giftMode ? '6px solid var(--accent-neon-purple)' : '2px solid var(--text-muted)',
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="card glass-panel" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: '24px' }}>
                Order Summary
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              {giftMode && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    color: 'var(--accent-neon-purple)',
                  }}
                >
                  <span>Gift Packaging</span>
                  <span>+{formatPrice(giftFee)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Taxes</span>
                <span>$0.00</span>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px',
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Estimated Total</span>
                <span className="heading-md text-gradient-accent">{formatPrice(displayTotal)}</span>
              </div>

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                }}
              >
                <Info size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                Your order contains bespoke items. Estimated manufacturing time is 48-72 hours before
                shipment.
              </p>

              <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }}>
                Proceed to Checkout <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

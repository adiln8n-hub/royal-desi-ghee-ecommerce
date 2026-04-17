import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    return e;
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!items.length) return;

    setSubmitting(true);
    try {
      const payload = {
        customer: { name: form.name, phone: form.phone, address: form.address, city: form.city },
        items: items.map(i => ({
          product: i.product,
          quantity: i.quantity,
          weight: i.weight,
        })),
        notes: form.notes,
      };
      const res = await axios.post('/api/orders', payload);
      clearCart();
      navigate('/order-confirmed', { state: { order: res.data.order } });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to place order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh' }}>
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <Link to="/products" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>{t.checkout.title}</h1></div>
      </div>

      <div className="section-py">
        <div className="container">
          <div className="checkout-layout">
            {/* Form */}
            <div className="checkout-form-wrap">
              <form id="checkout-form" onSubmit={handleSubmit}>
                <div className="checkout-card">
                  <h3 className="checkout-card-title">👤 {t.checkout.customerInfo}</h3>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="name">{t.checkout.name} *</label>
                      <input id="name" name="name" className={`form-control ${errors.name ? 'error' : ''}`}
                        value={form.name} onChange={handleChange} placeholder="Muhammad Ali" />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">{t.checkout.phone} *</label>
                      <input id="phone" name="phone" className={`form-control ${errors.phone ? 'error' : ''}`}
                        value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">{t.checkout.address} *</label>
                    <input id="address" name="address" className={`form-control ${errors.address ? 'error' : ''}`}
                      value={form.address} onChange={handleChange} placeholder="House #12, Street 5, Block C" />
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">{t.checkout.city} *</label>
                    <input id="city" name="city" className={`form-control ${errors.city ? 'error' : ''}`}
                      value={form.city} onChange={handleChange} placeholder="Lahore" />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">{t.checkout.notes}</label>
                    <textarea id="notes" name="notes" className="form-control"
                      value={form.notes} onChange={handleChange} placeholder={t.checkout.notesPlaceholder} rows={3} />
                  </div>
                </div>

                {/* Payment */}
                <div className="checkout-card">
                  <h3 className="checkout-card-title">💰 {t.checkout.payment}</h3>
                  <div className="cod-badge">
                    <span className="cod-icon">💵</span>
                    <div>
                      <div className="cod-title">{t.checkout.cod}</div>
                      <div className="cod-desc">Pay when you receive your order. 100% safe.</div>
                    </div>
                    <div className="cod-check">✓</div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="error-alert">{errors.submit}</div>
                )}

                <button type="submit" id="place-order-btn" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? '⏳ Placing Order...' : `✅ ${t.checkout.placeOrder}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <aside className="checkout-summary">
              <div className="checkout-card">
                <h3 className="checkout-card-title">🛒 {t.checkout.orderSummary}</h3>

                <div className="checkout-items">
                  {items.map(item => (
                    <div key={item.key} className="checkout-item">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop'}
                        alt={item.title}
                        className="checkout-item-img"
                      />
                      <div className="checkout-item-info">
                        <span className="checkout-item-title">{item.title}</span>
                        {item.weight && <span className="checkout-item-meta">{item.weight}</span>}
                        <span className="checkout-item-meta">Qty: {item.quantity}</span>
                      </div>
                      <span className="checkout-item-price">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'free-tag' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row summary-total">
                    <strong>{t.cart.total}</strong>
                    <strong>Rs. {total.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/923441272427"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green"
                style={{ width: '100%', justifyContent: 'center' }}
                id="checkout-whatsapp-btn"
              >
                📱 Order via WhatsApp instead
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

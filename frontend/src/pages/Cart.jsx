import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Cart.css';

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal, deliveryFee, total } = useCart();
  const { t } = useLanguage();

  const FREE_DELIVERY_THRESHOLD = 2000;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header"><div className="container"><h1>{t.cart.title}</h1></div></div>
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <div className="icon">🛒</div>
          <h3>{t.cart.empty}</h3>
          <p>{t.cart.emptyDesc}</p>
          <Link to="/products" className="btn btn-primary btn-lg" id="cart-shop-now-btn">
            🛍️ {t.cart.shopNow}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header"><div className="container"><h1>{t.cart.title} ({items.length})</h1></div></div>

      <div className="section-py">
        <div className="container">
          {/* Free delivery progress */}
          <div className="delivery-progress-bar">
            {remaining > 0 ? (
              <>
                <p>
                  {t.cart.freeDeliveryMsg.replace('{amount}', `Rs. ${remaining.toLocaleString()}`)}
                </p>
                <div className="delivery-bar">
                  <div
                    className="delivery-fill"
                    style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="earned">{t.cart.freeDeliveryEarned}</p>
            )}
          </div>

          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {items.map(item => (
                <div key={item.key} className="cart-item">
                  <Link to={`/products/${item.product}`} className="cart-item-img-wrap">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop'}
                      alt={item.title}
                      className="cart-item-img"
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link to={`/products/${item.product}`} className="cart-item-title">
                      {item.title}
                    </Link>
                    {item.weight && <span className="cart-item-weight">Weight: {item.weight}</span>}
                    <span className="cart-item-price">
                      {t.common.currency} {item.price.toLocaleString()} each
                    </span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.key, item.quantity - 1)} aria-label="Decrease">−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.key, item.quantity + 1)} aria-label="Increase">+</button>
                    </div>
                    <span className="cart-item-total">
                      {t.common.currency} {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Remove ${item.title}`}
                      id={`remove-${item.key}`}
                    >
                      🗑 {t.cart.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="cart-summary">
              <h3 className="summary-title">{t.checkout.orderSummary}</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>{t.cart.subtotal}</span>
                  <span>{t.common.currency} {subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>{t.cart.delivery}</span>
                  <span className={deliveryFee === 0 ? 'free-tag' : ''}>
                    {deliveryFee === 0 ? t.cart.freeDelivery : `${t.common.currency} ${deliveryFee}`}
                  </span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>{t.cart.total}</span>
                  <span>{t.common.currency} {total.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }} id="proceed-checkout-btn">
                {t.cart.checkout} →
              </Link>

              <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                ← Continue Shopping
              </Link>

              <a
                href="https://wa.me/923441272427"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-order-direct"
                id="cart-whatsapp-btn"
              >
                📱 Prefer WhatsApp? Click here
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

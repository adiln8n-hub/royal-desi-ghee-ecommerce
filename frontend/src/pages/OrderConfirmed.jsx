import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './OrderConfirmed.css';

export default function OrderConfirmed() {
  const { state } = useLocation();
  const { t } = useLanguage();
  const order = state?.order;

  return (
    <div className="confirmed-page">
      <div className="confirmed-card animate-scale">
        <div className="confirmed-icon">🎉</div>
        <h1 className="confirmed-title">{t.confirmed.title}</h1>
        <p className="confirmed-subtitle">{t.confirmed.subtitle}</p>

        {order && (
          <div className="order-badge">
            <span className="order-label">{t.confirmed.orderNumber}</span>
            <span className="order-number">#{order.orderNumber}</span>
          </div>
        )}

        <p className="confirmed-message">{t.confirmed.message}</p>

        {order?.total && (
          <div className="order-total-confirm">
            <span>Total Amount</span>
            <strong>Rs. {order.total.toLocaleString()}</strong>
          </div>
        )}

        <div className="confirmed-actions">
          <Link to="/products" className="btn btn-primary btn-lg" id="continue-shopping-btn">
            🛍️ {t.confirmed.continueShopping}
          </Link>
          <a
            href="https://wa.me/923441272427"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-green btn-lg"
            id="track-whatsapp-btn"
          >
            📱 {t.confirmed.whatsapp}
          </a>
        </div>

        <div className="confirmed-info">
          <p>📞 Questions? Call us: <a href="tel:+923441272427">+92 344 127 2427</a></p>
          <p>💬 WhatsApp: <a href="https://wa.me/923441272427">wa.me/923441272427</a></p>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-crown">👑</span>
              <div>
                <div className="footer-brand-name">Royal Desi Ghee & Sweets</div>
                <div className="footer-brand-ur">رائل گھی اور مٹھائی</div>
              </div>
            </div>
            <p className="footer-tagline">
              Pure Desi Ghee & Traditional Pakistani Sweets. Crafted with generations of tradition.
            </p>
            <div className="footer-social">
              <a href="https://wa.me/923441272427" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-social" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=desi-ghee">Desi Ghee</Link></li>
              <li><Link to="/products?category=sohan-halwa">Sohan Halwa</Link></li>
              <li><Link to="/products?category=mithai">Mithai</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-icon">📱</span>
                <a href="tel:+923441272427">+92 344 127 2427</a>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:adiln8n@gmail.com">adiln8n@gmail.com</a>
              </li>
              <li>
                <span className="contact-icon">💬</span>
                <a href="https://wa.me/923441272427" target="_blank" rel="noopener noreferrer">WhatsApp Order</a>
              </li>
              <li>
                <span className="contact-icon">🕐</span>
                <span>Mon–Sat: 9 AM – 9 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t.newsletter.title}</h4>
            <p className="footer-newsletter-sub">{t.newsletter.subtitle}</p>
            <form className="footer-newsletter" onSubmit={e => { e.preventDefault(); }}>
              <input
                type="email"
                className="form-control newsletter-input"
                placeholder={t.newsletter.placeholder}
                aria-label="Email for newsletter"
                id="footer-newsletter-email"
              />
              <button type="submit" className="btn btn-primary btn-sm newsletter-btn">
                {t.newsletter.subscribe}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} Royal Ghee & Sweets. All rights reserved.</p>
          <p className="footer-ur-tagline">خالص کی ضمانت • Purity Guaranteed</p>
        </div>
      </div>
    </footer>
  );
}

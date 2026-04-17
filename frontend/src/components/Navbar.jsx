import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const { t, toggleLang, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/',         label: t.nav.home       },
    { to: '/products', label: t.nav.products   },
    { to: '/contact',  label: t.nav.contact    },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Royal Desi Ghee & Sweets Home">
          <span className="logo-crown">👑</span>
          <div className="logo-text">
            <span className="logo-main">Royal Desi Ghee</span>
            <span className="logo-sub">& Sweets</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links hidden-mobile" role="list">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`navbar-link ${location.pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="navbar-controls">
          {/* Language Toggle */}
          <button
            id="lang-toggle-btn"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label="Toggle language"
            title={lang === 'en' ? 'اردو میں تبدیل کریں' : 'Switch to English'}
          >
            <span className={lang === 'en' ? 'active-lang' : ''}>{lang === 'en' ? 'EN' : 'اردو'}</span>
            <span className="lang-sep">|</span>
            <span className={lang === 'ur' ? 'active-lang' : ''}>{lang === 'en' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-btn" aria-label={`Cart with ${totalItems} items`} id="cart-nav-btn">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && (
              <span className="cart-badge" aria-live="polite">{totalItems}</span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="hamburger visible-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            id="mobile-menu-btn"
          >
            <span className={`ham-line ${menuOpen ? 'open1' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open2' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open3' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`mobile-link ${location.pathname === to ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/cart" className="mobile-link" onClick={() => setMenuOpen(false)}>
              {t.nav.cart} {totalItems > 0 && `(${totalItems})`}
            </Link>
          </li>
          <li>
            <a
              href="https://wa.me/923441272427"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-link whatsapp-link"
            >
              📱 {t.hero.whatsapp}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

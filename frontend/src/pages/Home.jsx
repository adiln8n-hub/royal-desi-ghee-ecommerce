import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const TESTIMONIALS = [
  { name: 'Ahmed Khan', city: 'Lahore', rating: 5, comment: 'Best desi ghee I have ever tasted! The flavor is authentic and the quality is unmatched. Will definitely order again.' },
  { name: 'Fatima Malik', city: 'Karachi', rating: 5, comment: 'The Sohan Halwa is absolutely divine! Gifted it to my family on Eid and everyone loved it. 100% recommend.' },
  { name: 'Muhammad Ali', city: 'Islamabad', rating: 5, comment: 'Royal Ghee & Sweets never disappoints. The ghee aroma while cooking is heavenly. Fast delivery too!' },
  { name: 'Zainab Raza', city: 'Multan', rating: 5, comment: 'Ordered the Gulab Jamun and Barfi box — both were fresh and delicious. Perfect gift for celebrations!' },
  { name: 'Tariq Hussain', city: 'Faisalabad', rating: 5, comment: 'Pure and authentic taste. You can clearly tell the difference from market ghee. Highly trusted brand.' },
];

const CATEGORY_ICONS = {
  'desi-ghee': '🫙',
  'sohan-halwa': '🍯',
  'mithai': '🍬',
  'seasonal': '🎁',
};

export default function Home() {
  const { t, lang } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8'),
          axios.get('/api/categories'),
        ]);
        setFeatured(featRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=1600&h=900&fit=crop&q=85"
            alt="Premium desi ghee and sweets"
            className="hero-bg-img"
          />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">{t.hero.badge}</div>

          <h1 className="hero-title animate-fade-in">
            <span className="hero-title-main">{t.hero.title}</span>
            <span className="hero-title-accent">{t.hero.titleAccent}</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">{t.hero.subtitle}</p>
          <p className="hero-desc animate-fade-in-delay">{t.hero.description}</p>

          <div className="hero-actions animate-fade-in-delay">
            <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
              🛍️ {t.hero.cta}
            </Link>
            <a
              href="https://wa.me/923441272427"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white btn-lg"
              id="hero-whatsapp-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{flexShrink:0}}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.hero.whatsapp}
            </a>
          </div>

          <div className="hero-stats animate-fade-in-delay">
            <div className="hero-stat"><span className="stat-num">30+</span><span className="stat-lab">{t.story.stat1}</span></div>
            <div className="hero-divider" />
            <div className="hero-stat"><span className="stat-num">5K+</span><span className="stat-lab">{t.story.stat2}</span></div>
            <div className="hero-divider" />
            <div className="hero-stat"><span className="stat-num">20+</span><span className="stat-lab">{t.story.stat3}</span></div>
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden="true">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        </div>
      </section>

      {/* ── Offer Ticker ───────────────────────────────────────── */}
      <div className="offer-ticker" role="marquee" aria-label="Special offer">
        <div className="ticker-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ticker-item">{t.offer.text}</span>
          ))}
        </div>
      </div>

      {/* ── Trust Badges ───────────────────────────────────────── */}
      <section className="trust-section section-py">
        <div className="container trust-grid">
          {[
            { icon: '🌿', title: t.trust.pure, desc: t.trust.pureDesc },
            { icon: '👑', title: t.trust.quality, desc: t.trust.qualityDesc },
            { icon: '🚚', title: t.trust.delivery, desc: t.trust.deliveryDesc },
            { icon: '⭐', title: t.trust.authentic, desc: t.trust.authenticDesc },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="trust-card">
              <div className="trust-icon">{icon}</div>
              <h4 className="trust-title">{title}</h4>
              <p className="trust-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────── */}
      <section className="categories-section section-py" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <div className="ornament">✦</div>
            <h2 id="categories-heading">{t.categories.title}</h2>
            <p>{t.categories.subtitle}</p>
          </div>

          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="category-card"
                id={`category-${cat.slug}`}
              >
                <div className="cat-img-wrap">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'}
                    alt={cat.nameEn}
                    loading="lazy"
                  />
                  <div className="cat-overlay" />
                </div>
                <div className="cat-info">
                  <span className="cat-icon">{CATEGORY_ICONS[cat.slug] || '🍽️'}</span>
                  <h3 className="cat-name">{lang === 'ur' ? cat.nameUr : cat.nameEn}</h3>
                  <span className="cat-explore">{t.categories.explore} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────── */}
      <section className="featured-section section-py" aria-labelledby="featured-heading">
        <div className="container">
          <div className="section-header">
            <div className="ornament">✦</div>
            <h2 id="featured-heading">{t.featured.title}</h2>
            <p>{t.featured.subtitle}</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🫙</div>
              <h3>Products loading soon</h3>
              <p>Check back shortly or connect to the backend server.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg" id="view-all-products-btn">
              {t.featured.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story ─────────────────────────────────────────── */}
      <section className="story-section section-py">
        <div className="container story-inner">
          <div className="story-img-wrap animate-fade-left">
            <img
              src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&h=700&fit=crop&q=85"
              alt="Traditional ghee making process"
              className="story-img"
            />
            <div className="story-img-badge">
              <span className="story-badge-num">30+</span>
              <span className="story-badge-text">Years of Purity</span>
            </div>
          </div>

          <div className="story-content animate-fade-right">
            <div className="section-badge">{t.story.badge}</div>
            <h2>{t.story.title}</h2>
            <div className="ornament">✦ ✦ ✦</div>
            <p>{t.story.p1}</p>
            <p>{t.story.p2}</p>
            <p>{t.story.p3}</p>
            <div className="story-stats">
              <div className="story-stat"><span className="stat-n">30+</span><span className="stat-l">{t.story.stat1}</span></div>
              <div className="story-stat"><span className="stat-n">5K+</span><span className="stat-l">{t.story.stat2}</span></div>
              <div className="story-stat"><span className="stat-n">20+</span><span className="stat-l">{t.story.stat3}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/products" className="btn btn-primary" id="story-shop-btn">
                🛍️ {t.hero.cta}
              </Link>
              <Link to="/contact" className="btn btn-outline" id="story-contact-btn">
                {t.story.learnMore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="testimonials-section section-py" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-header">
            <div className="ornament" style={{ color: 'var(--gold-pale)' }}>✦</div>
            <h2 id="testimonials-heading" style={{ color: 'var(--white)' }}>{t.testimonials.title}</h2>
            <p style={{ color: 'rgba(253,248,240,0.65)' }}>{t.testimonials.subtitle}</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((tm, i) => (
              <div
                key={i}
                className={`testimonial-card ${i === testimonialIdx ? 'active' : ''}`}
                aria-hidden={i !== testimonialIdx}
              >
                <div className="stars">
                  {[...Array(tm.rating)].map((_, j) => <span key={j} className="star">★</span>)}
                </div>
                <p className="tm-comment">"{tm.comment}"</p>
                <div className="tm-author">
                  <div className="tm-avatar">{tm.name[0]}</div>
                  <div>
                    <div className="tm-name">{tm.name}</div>
                    <div className="tm-city">📍 {tm.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="tm-dots" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`tm-dot ${i === testimonialIdx ? 'active' : ''}`}
                onClick={() => setTestimonialIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                role="tab"
                aria-selected={i === testimonialIdx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ─────────────────────────────────────────── */}
      <section className="wa-cta-section">
        <div className="container wa-cta-inner">
          <div>
            <h2>Order Now on WhatsApp! 📱</h2>
            <p>Quick, easy ordering — just send us a message and we'll handle the rest.</p>
          </div>
          <a
            href="https://wa.me/923441272427"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg wa-cta-btn"
            id="wa-cta-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style={{flexShrink:0}}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order on WhatsApp — +92 344 127 2427
          </a>
        </div>
      </section>
    </div>
  );
}

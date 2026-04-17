import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setImgIdx(0);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedWeight(res.data.weightOptions?.[0]?.label || '');
        if (res.data.category) {
          const rel = await axios.get(`/api/products?category=${res.data.category._id}&limit=4`);
          setRelated((rel.data.products || []).filter(p => p._id !== id));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-center" style={{ minHeight: '70vh' }}><div className="spinner" /></div>;
  if (!product) return (
    <div className="empty-state" style={{ minHeight: '70vh' }}>
      <div className="icon">❌</div>
      <h3>Product not found</h3>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  const title = lang === 'ur' ? product.titleUr : product.titleEn;
  const description = lang === 'ur' ? product.descriptionUr : product.descriptionEn;
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop'];

  const handleAdd = () => {
    if (product.stock < 1) return;
    addToCart(product, selectedWeight, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/products">Products</Link>
            <span>›</span>
            <span>{title}</span>
          </nav>
        </div>
      </div>

      <div className="section-py">
        <div className="container">
          <div className="product-detail-grid">

            {/* Images */}
            <div className="product-images">
              <div className="main-img-wrap">
                <img src={images[imgIdx]} alt={title} className="main-img" />
                {hasDiscount && <span className="detail-discount-badge">-{discountPct}%</span>}
              </div>
              {images.length > 1 && (
                <div className="thumb-row">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`thumb-btn ${i === imgIdx ? 'active' : ''}`}
                      onClick={() => setImgIdx(i)}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={img} alt={`${title} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail-info">
              {product.category && (
                <Link to={`/products?category=${product.category._id}`} className="product-category">
                  {lang === 'ur' ? product.category.nameUr : product.category.nameEn}
                </Link>
              )}
              <h1 className="detail-title">{title}</h1>

              <div className="detail-price-row">
                <span className="price-current">
                  {t.common.currency} {price.toLocaleString()}
                </span>
                {hasDiscount && <>
                  <span className="price-original">{t.common.currency} {product.price.toLocaleString()}</span>
                  <span className="price-discount-badge">Save {discountPct}%</span>
                </>}
              </div>

              <div className={`detail-stock ${product.stock > 0 ? 'in' : 'out'}`}>
                <span className={`stock-dot ${product.stock > 0 ? 'in-stock' : 'out-stock'}`} />
                {product.stock > 0
                  ? `${t.product.inStock} — ${product.stock} units left`
                  : t.product.outOfStock}
              </div>

              {/* Weight */}
              {product.weightOptions?.length > 0 && (
                <div className="detail-section">
                  <h4 className="detail-section-title">{t.product.weight}</h4>
                  <div className="weight-options">
                    {product.weightOptions.map(opt => (
                      <button
                        key={opt.label}
                        className={`weight-pill ${selectedWeight === opt.label ? 'active' : ''}`}
                        onClick={() => setSelectedWeight(opt.label)}
                      >
                        {opt.label}
                        {opt.price && <span style={{ fontSize: '0.7rem', display: 'block' }}>
                          {t.common.currency} {opt.price.toLocaleString()}
                        </span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty */}
              <div className="detail-section">
                <h4 className="detail-section-title">{t.product.qty}</h4>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="detail-actions">
                <button
                  id="detail-add-to-cart-btn"
                  className={`btn btn-primary btn-lg ${added ? 'btn-added' : ''}`}
                  onClick={handleAdd}
                  disabled={product.stock < 1}
                  style={{ flex: 1 }}
                >
                  {added ? '✓ Added to Cart!' : product.stock > 0 ? `🛒 ${t.product.addToCart}` : t.product.outOfStock}
                </button>
                <a
                  href={`https://wa.me/923441272427?text=Hi! I want to order: ${title} (${selectedWeight}), Qty: ${qty}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-green btn-lg"
                  id="detail-whatsapp-order-btn"
                  style={{ flex: 1 }}
                >
                  📱 WhatsApp Order
                </a>
              </div>

              {/* Description */}
              <div className="detail-section product-description">
                <h4 className="detail-section-title">{t.product.description}</h4>
                <p>{description}</p>
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {product.tags.map(tag => (
                    <span key={tag} className="badge badge-gold">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="related-section">
              <div className="section-header">
                <h2>{t.product.relatedProducts}</h2>
              </div>
              <div className="products-grid">
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

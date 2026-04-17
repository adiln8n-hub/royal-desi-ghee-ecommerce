import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions?.[0]?.label || ''
  );
  const [added, setAdded] = useState(false);

  const title = lang === 'ur' ? product.titleUr : product.titleEn;
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addToCart(product, selectedWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card" role="article">
      <Link to={`/products/${product._id}`} className="product-card-img-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'}
          alt={title}
          className="product-card-img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card-badges">
          {hasDiscount && (
            <span className="badge badge-discount">-{discountPct}%</span>
          )}
          {!inStock && (
            <span className="badge badge-oos">Sold Out</span>
          )}
        </div>

        {product.isFeatured && (
          <span className="badge-featured">⭐ Featured</span>
        )}
      </Link>

      <div className="product-card-info">
        {/* Category */}
        {product.category && (
          <span className="product-category">
            {lang === 'ur' ? product.category.nameUr : product.category.nameEn}
          </span>
        )}

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="product-title">{title}</h3>
        </Link>

        {/* Price */}
        <div className="product-price-row">
          <span className="price-current">{t.common.currency} {price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="price-original">{t.common.currency} {product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Weight Options */}
        {product.weightOptions?.length > 0 && (
          <div className="weight-options">
            {product.weightOptions.map(opt => (
              <button
                key={opt.label}
                className={`weight-pill ${selectedWeight === opt.label ? 'active' : ''}`}
                onClick={() => setSelectedWeight(opt.label)}
                aria-pressed={selectedWeight === opt.label}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Stock indicator */}
        <div className="stock-row">
          <span className={`stock-dot ${inStock ? 'in-stock' : 'out-stock'}`} />
          <span className="stock-label">
            {inStock
              ? `${t.product.inStock} (${product.stock})`
              : t.product.outOfStock}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product._id}`}
          className={`btn btn-primary btn-add-cart ${added ? 'btn-added' : ''}`}
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={`Add ${title} to cart`}
        >
          {added ? '✓ Added!' : inStock ? `🛒 ${t.product.addToCart}` : t.product.outOfStock}
        </button>
      </div>
    </div>
  );
}

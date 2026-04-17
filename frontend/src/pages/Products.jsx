import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (categoryId) params.set('category', categoryId);
      if (search) params.set('search', search);
      const res = await axios.get(`/api/products?${params}`);
      setProducts(res.data.products || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryId, search, page]);

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data || []));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [categoryId, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.elements.search.value.trim();
    setSearchParams(val ? { search: val } : {});
  };

  const setCategory = (id) => {
    setSearchParams(id ? { category: id } : {});
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>{t.nav.products}</h1>
          <p>{t.featured.subtitle}</p>
        </div>
      </div>

      <div className="section-py">
        <div className="container">
          <div className="products-page-layout">

            {/* Sidebar */}
            <aside className="products-sidebar">
              {/* Search */}
              <div className="sidebar-section">
                <h4 className="sidebar-title">🔍 {t.common.search.replace('...', '')}</h4>
                <form onSubmit={handleSearch}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      name="search"
                      defaultValue={search}
                      className="form-control"
                      placeholder={t.common.search}
                      style={{ fontSize: '0.875rem' }}
                      id="product-search-input"
                    />
                    <button type="submit" className="btn btn-primary btn-sm" id="product-search-btn">→</button>
                  </div>
                </form>
              </div>

              {/* Category Filter */}
              <div className="sidebar-section">
                <h4 className="sidebar-title">📂 {t.common.filter}</h4>
                <ul className="cat-filter-list">
                  <li>
                    <button
                      id="filter-all"
                      className={`cat-filter-btn ${!categoryId ? 'active' : ''}`}
                      onClick={() => setCategory('')}
                    >
                      {t.common.all}
                      <span className="cat-count">{total}</span>
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <button
                        id={`filter-${cat.slug}`}
                        className={`cat-filter-btn ${categoryId === cat._id ? 'active' : ''}`}
                        onClick={() => setCategory(cat._id)}
                      >
                        {lang === 'ur' ? cat.nameUr : cat.nameEn}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WhatsApp Quick Order */}
              <div className="sidebar-wa">
                <p>Need help choosing? Order directly!</p>
                <a
                  href="https://wa.me/923441272427"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-green"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  📱 WhatsApp Order
                </a>
              </div>
            </aside>

            {/* Main grid */}
            <main className="products-main">
              <div className="products-toolbar">
                <p className="results-count">
                  {total} products found
                  {search && ` for "${search}"`}
                </p>
              </div>

              {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🫙</div>
                  <h3>{t.common.noProducts}</h3>
                  <p>Try a different search or category.</p>
                  <button className="btn btn-outline" onClick={() => setSearchParams({})}>
                    {t.common.all} products
                  </button>
                </div>
              ) : (
                <div className="products-grid-page">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    id="page-prev-btn"
                  >← Prev</button>
                  <span className="page-info">Page {page} of {totalPages}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    id="page-next-btn"
                  >Next →</button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

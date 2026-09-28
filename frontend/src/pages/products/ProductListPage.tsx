import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts, setFilters, setPage } from '../../store/slices/productSlice';
import { ProductCard, ProductCardSkeleton } from '../../components/product/ProductCard';
import './ProductListPage.css';

const CATEGORIES = ['All', 'Smartphones', 'Watches', 'Electronics', 'Cosmetics', 'Furniture', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name A-Z' },
];

export const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list, loading, error, filters } = useAppSelector((s) => s.products);

  const categoryParam = searchParams.get('category') || '';
  const qParam = searchParams.get('q') || '';

  // Single source of truth: derive active filters from URL params + Redux filters,
  // then fetch whenever any of them change.
  useEffect(() => {
    dispatch(fetchProducts({
      ...filters,
      category: categoryParam,
      q: qParam,
    }));
  }, [categoryParam, qParam, filters.sort, filters.minPrice, filters.maxPrice, filters.page, filters.limit]);

  const handleCategoryChange = (cat: string) => {
    const newParams: Record<string, string> = {};
    if (cat && cat !== 'All') newParams.category = cat;
    // Preserve search query if present
    if (qParam) newParams.q = qParam;
    setSearchParams(newParams);
    // Reset page when category changes
    dispatch(setFilters({ page: 1 }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sort: e.target.value as typeof filters.sort }));
  };

  const handlePriceFilter = (min?: number, max?: number) => {
    dispatch(setFilters({ minPrice: min, maxPrice: max, page: 1 }));
  };

  const loadProducts = () => {
    dispatch(fetchProducts({ ...filters, category: categoryParam, q: qParam }));
  };

  const activeCategory = categoryParam;

  return (
    <main className="plp" id="product-list-page">
      <div className="container">
        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav className="plp__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" id="breadcrumb-home">Home</Link>
          <span>›</span>
          <span>{activeCategory || qParam ? (activeCategory || `Search: "${qParam}"`) : 'All Products'}</span>
        </nav>

        <div className="plp__layout">
          {/* ── Sidebar Filters ─────────────────────────── */}
          <aside className="plp__sidebar" id="filters-sidebar" aria-label="Product filters">
            <div className="plp__filter-card">
              <h3 className="plp__filter-title">Categories</h3>
              <ul className="plp__filter-list" role="list">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      id={`filter-cat-${cat.toLowerCase()}`}
                      className={`plp__filter-btn ${
                        (cat === 'All' && !activeCategory) || activeCategory === cat
                          ? 'plp__filter-btn--active'
                          : ''
                      }`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="plp__filter-card">
              <h3 className="plp__filter-title">Price Range</h3>
              <div className="plp__price-filters">
                {[
                  { label: 'Under ₹1,000', min: undefined, max: 1000 },
                  { label: '₹1,000 – ₹5,000', min: 1000, max: 5000 },
                  { label: '₹5,000 – ₹20,000', min: 5000, max: 20000 },
                  { label: '₹20,000 – ₹50,000', min: 20000, max: 50000 },
                  { label: 'Above ₹50,000', min: 50000, max: undefined },
                ].map(({ label, min, max }) => (
                  <button
                    key={label}
                    id={`price-filter-${label.replace(/\s/g, '-')}`}
                    className={`plp__filter-btn ${
                      filters.minPrice === min && filters.maxPrice === max
                        ? 'plp__filter-btn--active'
                        : ''
                    }`}
                    onClick={() =>
                      filters.minPrice === min && filters.maxPrice === max
                        ? handlePriceFilter(undefined, undefined)
                        : handlePriceFilter(min, max)
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {(categoryParam || qParam || filters.minPrice || filters.maxPrice) && (
              <button
                id="clear-filters-btn"
                className="btn btn-ghost btn-full"
                onClick={() => {
                  setSearchParams({});
                  dispatch(setFilters({ category: '', minPrice: undefined, maxPrice: undefined, q: '', page: 1 }));
                }}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── Product Grid ─────────────────────────────── */}
          <div className="plp__main">
            {/* Toolbar */}
            <div className="plp__toolbar">
              <p className="plp__result-count" id="result-count">
                {loading ? 'Loading...' : `${list.total} products found`}
              </p>
              <select
                className="form-select plp__sort"
                value={filters.sort || 'newest'}
                onChange={handleSortChange}
                id="sort-select"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="plp__error" role="alert">
                <p>⚠️ {error}</p>
                <button className="btn btn-primary" onClick={loadProducts} id="retry-btn">Retry</button>
              </div>
            )}

            {/* Products */}
            {!error && (
              <div className="products-grid" id="products-grid">
                {loading
                  ? Array(12).fill(null).map((_, i) => <ProductCardSkeleton key={i} />)
                  : list.products.length === 0
                  ? (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                      <div className="empty-state__icon">🔍</div>
                      <h2 className="empty-state__title">No products found</h2>
                      <p className="empty-state__desc">Try adjusting your filters or search term</p>
                      <button
                        className="btn btn-primary"
                        id="reset-search-btn"
                        onClick={() => {
                          setSearchParams({});
                          dispatch(setFilters({ category: '', minPrice: undefined, maxPrice: undefined, q: '', page: 1 }));
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )
                  : list.products.map((p) => <ProductCard key={p._id} product={p} />)
                }
              </div>
            )}

            {/* Pagination */}
            {!loading && list.totalPages > 1 && (
              <nav className="plp__pagination" aria-label="Pagination">
                <button
                  className="btn btn-ghost"
                  disabled={list.page <= 1}
                  id="prev-page-btn"
                  onClick={() => dispatch(setPage(list.page - 1))}
                >
                  ← Prev
                </button>

                <div className="plp__page-numbers">
                  {Array.from({ length: Math.min(list.totalPages, 7) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        id={`page-btn-${page}`}
                        className={`plp__page-btn ${list.page === page ? 'plp__page-btn--active' : ''}`}
                        onClick={() => dispatch(setPage(page))}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-ghost"
                  disabled={list.page >= list.totalPages}
                  id="next-page-btn"
                  onClick={() => dispatch(setPage(list.page + 1))}
                >
                  Next →
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts } from '../../store/slices/productSlice';
import { ProductCard, ProductCardSkeleton } from '../../components/product/ProductCard';
import './HomePage.css';

const HERO_SLIDES = [
  {
    title: 'SMART WEARABLE.',
    subtitle: 'Best Deal Online on smart watches',
    badge: 'UP to 80% OFF',
    bg: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #0288D1 100%)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
  {
    title: 'FLAGSHIP PHONES.',
    subtitle: 'Grab the best deals on Smartphones',
    badge: 'UP to 56% OFF',
    bg: 'linear-gradient(135deg, #1A237E 0%, #283593 60%, #303F9F 100%)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
  },
  {
    title: 'PREMIUM SOUND.',
    subtitle: 'World class audio at unbeatable prices',
    badge: 'UP to 40% OFF',
    bg: 'linear-gradient(135deg, #004D40 0%, #00695C 60%, #00897B 100%)',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
];

const TOP_CATEGORIES = [
  { name: 'Mobile', icon: '📱', color: '#E3F2FD' },
  { name: 'Cosmetics', icon: '💄', color: '#FCE4EC' },
  { name: 'Electronics', icon: '💻', color: '#E8EAF6' },
  { name: 'Furniture', icon: '🪑', color: '#FFF3E0' },
  { name: 'Watches', icon: '⌚', color: '#E0F7FA' },
  { name: 'Decor', icon: '🌿', color: '#E8F5E9' },
  { name: 'Accessories', icon: '👜', color: '#FFF9C4' },
];

const BRANDS = [
  { name: 'Apple', bg: '#1A1A1A', color: '#fff', icon: '🍎', discount: '80%' },
  { name: 'Realme', bg: '#FFF8E1', color: '#333', icon: '📱', discount: '80%' },
  { name: 'Xiaomi', bg: '#FFF3E0', color: '#333', icon: '📲', discount: '80%' },
  { name: 'Samsung', bg: '#E3F2FD', color: '#1565C0', icon: '📱', discount: '56%' },
];

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((s) => s.products);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 10, sort: 'newest' }));
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const slide = HERO_SLIDES[slideIndex];

  return (
    <main className="homepage" id="homepage">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <section className="hero" id="hero-banner" style={{ background: slide.bg }}>
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__sub">{slide.subtitle}</p>
            <h1 className="hero__title">{slide.title}</h1>
            <span className="hero__badge">{slide.badge}</span>
            <Link to="/products" className="hero__cta btn btn-primary btn-lg" id="shop-now-btn">
              Shop Now →
            </Link>
          </div>
          <div className="hero__image-wrap">
            <img src={slide.image} alt={slide.title} className="hero__image" />
          </div>
        </div>
        {/* Dots */}
        <div className="hero__dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === slideIndex ? 'hero__dot--active' : ''}`}
              onClick={() => setSlideIndex(i)}
              id={`hero-dot-${i}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        {/* Arrows */}
        <button
          className="hero__arrow hero__arrow--left"
          onClick={() => setSlideIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous slide"
        >‹</button>
        <button
          className="hero__arrow hero__arrow--right"
          onClick={() => setSlideIndex((i) => (i + 1) % HERO_SLIDES.length)}
          aria-label="Next slide"
        >›</button>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="section" id="featured-products">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">
              Grab the best deal on <span>Smartphones</span>
            </h2>
            <Link to="/products?category=Smartphones" className="section-heading__link" id="view-all-phones">
              View All →
            </Link>
          </div>

          <div className="products-grid">
            {loading
              ? Array(5).fill(null).map((_, i) => <ProductCardSkeleton key={i} />)
              : list.products
                  .filter((p) => p.category === 'Smartphones')
                  .slice(0, 5)
                  .map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Top Categories ───────────────────────────────── */}
      <section className="section bg-section" id="top-categories">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">
              Shop From <span>Top Categories</span>
            </h2>
            <Link to="/products" className="section-heading__link" id="view-all-categories">
              View All →
            </Link>
          </div>

          <div className="categories-row" role="list">
            {TOP_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className="category-chip"
                id={`cat-${cat.name.toLowerCase()}`}
                role="listitem"
                style={{ '--cat-bg': cat.color } as React.CSSProperties}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                aria-label={`Shop ${cat.name}`}
              >
                <div className="category-chip__icon" style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <span className="category-chip__name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Electronics Brands ───────────────────────── */}
      <section className="section" id="top-brands">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">
              Top <span>Electronics Brands</span>
            </h2>
            <Link to="/products" className="section-heading__link" id="view-all-brands">
              View All →
            </Link>
          </div>

          <div className="brands-grid">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="brand-card"
                id={`brand-${brand.name.toLowerCase()}`}
                style={{ background: brand.bg }}
                onClick={() => navigate(`/products?q=${brand.name}`)}
                role="button"
                tabIndex={0}
                aria-label={`${brand.name} - UP to ${brand.discount} OFF`}
              >
                <div className="brand-card__badge">{brand.name.toUpperCase()}</div>
                <p className="brand-card__offer" style={{ color: brand.color }}>
                  UP to {brand.discount} OFF
                </p>
                <span className="brand-card__icon">{brand.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Products Listing ─────────────────────────── */}
      <section className="section bg-section" id="all-products">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-heading__title">
              Daily <span>Essentials</span>
            </h2>
            <Link to="/products" className="section-heading__link" id="view-all-products">
              View All →
            </Link>
          </div>

          <div className="products-grid">
            {loading
              ? Array(8).fill(null).map((_, i) => <ProductCardSkeleton key={i} />)
              : list.products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          <div className="homepage__cta-wrap">
            <Link to="/products" className="btn btn-primary btn-lg" id="browse-all-btn">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProductBySlug, clearDetail } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import type { ProductVariant } from '../../types';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { detail: product, detailLoading, error } = useAppSelector((s) => s.products);
  const { loading: cartLoading } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => { dispatch(clearDetail()); };
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth/login');
      return;
    }
    if (!product || !selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      toast.error(`Only ${selectedVariant.stock} units available`);
      return;
    }

    const result = await dispatch(addToCart({
      productId: product._id,
      variantSku: selectedVariant.sku,
      quantity,
    }));

    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart! 🛒');
    } else {
      toast.error(result.payload as string || 'Failed to add to cart');
    }
  };

  const discountPct = selectedVariant
    ? 30 + Math.floor((product?.name?.length ?? 0) % 4) * 7
    : 0;
  const originalPrice = selectedVariant
    ? Math.round(selectedVariant.price / (1 - discountPct / 100))
    : 0;

  if (detailLoading) return (
    <div className="pdp pdp--loading">
      <div className="container pdp__skeleton">
        <div className="pdp__img-skeleton skeleton" />
        <div className="pdp__content-skeleton">
          <div className="skeleton" style={{ height: 32, width: '80%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 48, width: '40%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 100, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 52, width: '100%' }} />
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="empty-state" id="product-not-found">
      <div className="empty-state__icon">😕</div>
      <h1 className="empty-state__title">Product not found</h1>
      <p className="empty-state__desc">{error || 'This product does not exist'}</p>
      <Link to="/products" className="btn btn-primary" id="back-to-products-btn">← Back to Products</Link>
    </div>
  );

  return (
    <main className="pdp" id="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" id="pdp-breadcrumb-home">Home</Link>
          <span>›</span>
          <Link to={`/products?category=${product.category}`} id="pdp-breadcrumb-category">{product.category}</Link>
          <span>›</span>
          <span className="pdp__breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pdp__layout">
          {/* ── Image Gallery ───────────────────────────── */}
          <div className="pdp__gallery" id="product-gallery">
            <div className="pdp__main-image-wrap">
              <img
                src={product.images[activeImage] || 'https://placehold.co/500x500?text=No+Image'}
                alt={product.name}
                className="pdp__main-image"
                id="main-product-image"
              />
              {discountPct > 0 && (
                <div className="badge-discount">{discountPct}% OFF</div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="pdp__thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pdp__thumb ${i === activeImage ? 'pdp__thumb--active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    id={`thumbnail-${i}`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ─────────────────────────────── */}
          <div className="pdp__info" id="product-info">
            {product.brand && <span className="pdp__brand" id="product-brand">{product.brand}</span>}
            <h1 className="pdp__title" id="product-name">{product.name}</h1>

            {/* Price */}
            {selectedVariant && (
              <div className="pdp__price-section" id="product-pricing">
                <div className="pdp__price-row">
                  <span className="pdp__price-current">
                    ₹{selectedVariant.price.toLocaleString('en-IN')}
                  </span>
                  <span className="pdp__price-original">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="badge badge-primary">{discountPct}% OFF</span>
                </div>
                <p className="pdp__price-save">
                  You save ₹{(originalPrice - selectedVariant.price).toLocaleString('en-IN')}
                </p>
                <p className={`pdp__stock ${selectedVariant.stock === 0 ? 'pdp__stock--out' : selectedVariant.stock <= 3 ? 'pdp__stock--low' : 'pdp__stock--in'}`}
                  id="stock-status"
                >
                  {selectedVariant.stock === 0
                    ? '❌ Out of Stock'
                    : selectedVariant.stock <= 3
                    ? `⚡ Only ${selectedVariant.stock} left!`
                    : `✅ In Stock (${selectedVariant.stock} available)`}
                </p>
              </div>
            )}

            {/* Colour Variants */}
            {product.variants.some((v) => v.colour) && (
              <div className="pdp__variants" id="colour-variants">
                <h3 className="pdp__variants-label">Colour</h3>
                <div className="pdp__variant-btns">
                  {product.variants.filter((v) => v.colour).map((v) => (
                    <button
                      key={v.sku}
                      id={`variant-colour-${v.sku}`}
                      className={`pdp__variant-btn ${selectedVariant?.sku === v.sku ? 'pdp__variant-btn--active' : ''} ${v.stock === 0 ? 'pdp__variant-btn--oos' : ''}`}
                      onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                      disabled={v.stock === 0}
                      aria-label={`${v.colour} - ₹${v.price.toLocaleString('en-IN')}`}
                    >
                      {v.colour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {product.variants.some((v) => v.size) && (
              <div className="pdp__variants" id="size-variants">
                <h3 className="pdp__variants-label">Size / Storage</h3>
                <div className="pdp__variant-btns">
                  {product.variants.filter((v) => v.size).map((v) => (
                    <button
                      key={v.sku}
                      id={`variant-size-${v.sku}`}
                      className={`pdp__variant-btn ${selectedVariant?.sku === v.sku ? 'pdp__variant-btn--active' : ''} ${v.stock === 0 ? 'pdp__variant-btn--oos' : ''}`}
                      onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                      disabled={v.stock === 0}
                      aria-label={`${v.size} - ₹${v.price.toLocaleString('en-IN')}`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="pdp__qty" id="quantity-selector">
                <h3 className="pdp__variants-label">Quantity</h3>
                <div className="pdp__qty-controls">
                  <button
                    className="pdp__qty-btn"
                    id="qty-decrement"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="pdp__qty-value" id="qty-display">{quantity}</span>
                  <button
                    className="pdp__qty-btn"
                    id="qty-increment"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    disabled={quantity >= selectedVariant.stock}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pdp__actions">
              <button
                className="btn btn-primary btn-lg pdp__add-btn"
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant || selectedVariant.stock === 0}
                aria-label="Add to cart"
              >
                🛒 {cartLoading ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Description */}
            <div className="pdp__description" id="product-description">
              <h3>About this product</h3>
              <p>{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="pdp__tags">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/products?q=${tag}`}
                    className="pdp__tag"
                    id={`tag-${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { loading } = useAppSelector((s) => s.cart);

  // Use lowest-price variant as the "display" variant
  const displayVariant = product.variants.reduce((min, v) =>
    v.price < min.price ? v : min,
    product.variants[0],
  );

  // Assume a "compare at" price as 30-56% higher for demo (matching Figma)
  const discountPct = 30 + Math.floor((product.name.length % 4) * 7);
  const originalPrice = Math.round(displayVariant.price / (1 - discountPct / 100));
  const savings = originalPrice - displayVariant.price;

  const inStock = displayVariant.stock > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth/login');
      return;
    }
    if (!inStock) return;

    const result = await dispatch(
      addToCart({
        productId: product._id,
        variantSku: displayVariant.sku,
        quantity: 1,
      }),
    );

    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.payload as string || 'Failed to add to cart');
    }
  };

  return (
    <article
      className="product-card"
      onClick={() => navigate(`/products/${product.slug}`)}
      id={`product-card-${product._id}`}
      role="article"
      aria-label={product.name}
    >
      {/* Discount badge */}
      <div className="badge-discount" aria-label={`${discountPct}% off`}>
        {discountPct}% OFF
      </div>

      {/* Image */}
      <div className="product-card__image-wrap">
        <img
          src={product.images[0] || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {!inStock && (
          <div className="product-card__out-of-stock">Out of Stock</div>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__price-row">
          <span className="product-card__price">
            ₹{displayVariant.price.toLocaleString('en-IN')}
          </span>
          <span className="product-card__original">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="product-card__save">
          Save - ₹{savings.toLocaleString('en-IN')}
        </div>

        <button
          className="product-card__add-btn"
          onClick={handleAddToCart}
          disabled={loading || !inStock}
          id={`add-to-cart-${product._id}`}
          aria-label={`Add ${product.name} to cart`}
        >
          {!inStock ? 'Out of Stock' : loading ? '...' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card" aria-busy="true">
    <div className="product-card__image-wrap skeleton" style={{ aspectRatio: '1', borderRadius: 0 }} />
    <div className="product-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="skeleton" style={{ height: 16, width: '85%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 36, borderRadius: 6, marginTop: 4 }} />
    </div>
  </div>
);

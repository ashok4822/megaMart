import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logoutUser } from '../../store/slices/authSlice';
import { clearCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import './Header.css';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAppSelector((s) => s.auth);
  const { cart } = useAppSelector((s) => s.cart);

  const itemCount = cart?.itemCount ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const categories = [
    'Groceries', 'Premium Fruits', 'Home & Kitchen',
    'Fashion', 'Electronics', 'Beauty',
  ];

  return (
    <header className="header" id="main-header">
      {/* Top bar */}
      <div className="header__topbar">
        <div className="container header__topbar-inner">
          <span>Welcome to worldwide MegaMart!</span>
          <div className="header__topbar-links">
            <span>📍 Deliver to 423651</span>
            <span>🚚 Track your order</span>
            <span>🏷️ All Offers</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="header__main">
        <div className="container header__main-inner">
          {/* Logo */}
          <Link to="/" className="header__logo" id="logo-link">
            <span className="header__logo-icon">🛒</span>
            <span className="header__logo-text">MegaMart</span>
          </Link>

          {/* Search */}
          <form className="header__search" onSubmit={handleSearch} id="search-form">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essentials, groceries and more..."
              className="header__search-input"
            />
            <button type="submit" className="header__search-btn" id="search-btn" aria-label="Search">
              🔍
            </button>
          </form>

          {/* Actions */}
          <div className="header__actions">
            {user ? (
              <div className="header__user-menu">
                <button
                  className="header__user-btn"
                  id="user-menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                >
                  <span className="header__user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="header__user-name">{user.name.split(' ')[0]}</span>
                  <span>▾</span>
                </button>
                {menuOpen && (
                  <div className="header__dropdown" id="user-dropdown">
                    <Link to="/orders" className="header__dropdown-item" onClick={() => setMenuOpen(false)}>
                      📦 My Orders
                    </Link>
                    <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleLogout} id="logout-btn">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="header__auth-btn" id="sign-in-btn">
                <span>👤</span>
                <span>Sign Up / Sign In</span>
              </Link>
            )}

            <Link to="/cart" className="header__cart-btn" id="cart-btn" aria-label={`Cart with ${itemCount} items`}>
              <span className="header__cart-icon">🛒</span>
              <span className="header__cart-label">Cart</span>
              {itemCount > 0 && (
                <span className="header__cart-badge" id="cart-count">{itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="header__nav" id="category-nav" aria-label="Product categories">
        <div className="container header__nav-inner">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className={`header__nav-item ${location.search.includes(cat) ? 'header__nav-item--active' : ''}`}
              id={`nav-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

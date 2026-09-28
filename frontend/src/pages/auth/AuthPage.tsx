import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import './AuthPage.css';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<AuthMode>(
    location.pathname.includes('register') ? 'register' : 'login',
  );
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      navigate('/');
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [mode, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      if (form.name.trim().length < 2) { toast.error('Name must be at least 2 characters'); return; }
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
      const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
      if (registerUser.fulfilled.match(result)) toast.success('Welcome to MegaMart! 🎉');
      else toast.error(result.payload as string || 'Registration failed');
    } else {
      const result = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (loginUser.fulfilled.match(result)) toast.success('Welcome back! 👋');
      else toast.error(result.payload as string || 'Login failed');
    }
  };

  return (
    <main className="auth-page" id="auth-page">
      <div className="auth-page__split">
        {/* Left: Brand panel */}
        <div className="auth-page__brand" role="img" aria-label="MegaMart brand panel">
          <div className="auth-page__brand-content">
            <div className="auth-page__logo">
              <span>🛒</span>
              <span>MegaMart</span>
            </div>
            <h2>Shop smarter, live better.</h2>
            <p>Access millions of products at unbeatable prices. Your world-class shopping experience starts here.</p>
            <div className="auth-page__brand-features">
              <div>✅ 30-day returns</div>
              <div>🚚 Free delivery on orders above ₹500</div>
              <div>🔒 Secure payments</div>
              <div>⭐ Trusted by 10M+ customers</div>
            </div>
          </div>
        </div>

        {/* Right: Form panel */}
        <div className="auth-page__form-wrap">
          <div className="auth-page__form-card">
            {/* Tabs */}
            <div className="auth-page__tabs" role="tablist">
              <button
                id="tab-login"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-page__tab ${mode === 'login' ? 'auth-page__tab--active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button
                id="tab-register"
                role="tab"
                aria-selected={mode === 'register'}
                className={`auth-page__tab ${mode === 'register' ? 'auth-page__tab--active' : ''}`}
                onClick={() => setMode('register')}
              >
                Create Account
              </button>
            </div>

            <h1 className="auth-page__title">
              {mode === 'login' ? 'Welcome back!' : 'Join MegaMart'}
            </h1>
            <p className="auth-page__subtitle">
              {mode === 'login'
                ? 'Sign in to your account to continue shopping'
                : 'Create your account and start saving today'}
            </p>

            <form className="auth-page__form" onSubmit={handleSubmit} id="auth-form">
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">Password</label>
                <div className="auth-page__pwd-wrap">
                  <input
                    id="auth-password"
                    type={showPwd ? 'text' : 'password'}
                    className="form-input"
                    placeholder={mode === 'register' ? 'Min 8 characters' : 'Your password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    minLength={mode === 'register' ? 8 : 1}
                  />
                  <button
                    type="button"
                    className="auth-page__pwd-toggle"
                    id="toggle-password"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-page__error" role="alert" id="auth-error">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                id="auth-submit-btn"
                disabled={loading}
              >
                {loading
                  ? '⏳ Please wait...'
                  : mode === 'login'
                  ? 'Sign In →'
                  : 'Create Account →'}
              </button>
            </form>

            <div className="auth-page__demo" id="demo-credentials">
              <p>🧪 Demo credentials:</p>
              <button
                id="fill-demo-user"
                className="btn btn-ghost btn-sm"
                onClick={() => setForm({ name: '', email: 'user@demo.com', password: 'Password123!' })}
              >
                Use Demo User
              </button>
              <button
                id="fill-demo-admin"
                className="btn btn-ghost btn-sm"
                onClick={() => setForm({ name: '', email: 'admin@demo.com', password: 'Password123!' })}
              >
                Use Admin
              </button>
            </div>

            <p className="auth-page__switch">
              {mode === 'login' ? (
                <>Don't have an account? <button id="switch-to-register" className="auth-page__link" onClick={() => setMode('register')}>Create one</button></>
              ) : (
                <>Already have an account? <button id="switch-to-login" className="auth-page__link" onClick={() => setMode('login')}>Sign In</button></>
              )}
            </p>

            <p className="auth-page__back">
              <Link to="/" id="back-to-home">← Back to MegaMart</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

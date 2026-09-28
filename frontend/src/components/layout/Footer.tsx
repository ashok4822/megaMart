import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  const categories = ['Staples', 'Beverages', 'Personal Care', 'Home Care', 'Baby Care', 'Dairy'];
  const services = ['About Us', 'Terms & Conditions', 'FAQ', 'Privacy Policy', 'Cancellation & Return Policy'];

  return (
    <footer className="footer" id="main-footer">
      <div className="container footer__grid">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span>🛒</span>
            <span className="footer__logo-text">MegaMart</span>
          </div>
          <div className="footer__contact">
            <h4>Contact Us</h4>
            <p>📱 WhatsApp: +1 202-918-2132</p>
            <p>📞 Call Us: +1 202-918-2132</p>
          </div>
          <div className="footer__apps">
            <h4>Download App</h4>
            <div className="footer__app-badges">
              <div className="footer__app-badge">🍎 App Store</div>
              <div className="footer__app-badge">▶ Google Play</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="footer__heading">Most Popular Categories</h4>
          <ul className="footer__links">
            {categories.map((cat) => (
              <li key={cat}>
                <Link to={`/products?category=${cat}`} className="footer__link">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="footer__heading">Customer Services</h4>
          <ul className="footer__links">
            {services.map((svc) => (
              <li key={svc}>
                <a href="#" className="footer__link">{svc}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="footer__heading">Follow Us</h4>
          <div className="footer__socials">
            {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((s) => (
              <a key={s} href="#" className="footer__social-btn" aria-label={s}>
                {s === 'Facebook' ? '📘' : s === 'Twitter' ? '🐦' : s === 'Instagram' ? '📸' : '▶'}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2026 MegaMart. All rights reserved.</p>
          <p>Built with ❤️ using MERN + TypeScript + Clean Architecture</p>
        </div>
      </div>
    </footer>
  );
};

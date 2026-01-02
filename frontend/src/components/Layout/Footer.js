import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🏪</span>
              <span className="logo-text">ShopKeeper<span className="logo-highlight">AI</span></span>
            </Link>
            <p className="footer-tagline">
              AI-powered assistant for small shopkeepers. Manage your business with simple chat commands.
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Features</h4>
              <Link to="/dashboard">AI Chat</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/invoices">Invoices</Link>
              <Link to="/reports">Reports</Link>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-column">
              <h4>Quick Commands</h4>
              <span className="command">Sold 5 rice at 85</span>
              <span className="command">Bought 50 rice at 70</span>
              <span className="command">Show inventory</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} ShopKeeperAI. All rights reserved.
          </p>
          
          <div className="footer-social">
            <a 
              href="https://www.linkedin.com/in/muhammad-hamza-khattak/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="mailto:mr.hamxa942@gmail.com"
              className="social-link"
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/mrhamxo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>

          <p className="developer">
            Made with ❤️ by <a href="https://www.linkedin.com/in/muhammad-hamza-khattak/" target="_blank" rel="noopener noreferrer">Muhammad Hamza</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

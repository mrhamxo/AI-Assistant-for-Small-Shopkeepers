import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-icons">
            <span className="float-icon icon-1">📦</span>
            <span className="float-icon icon-2">💰</span>
            <span className="float-icon icon-3">📊</span>
            <span className="float-icon icon-4">🧾</span>
            <span className="float-icon icon-5">🏪</span>
          </div>
        </div>
        
        <nav className="home-nav">
          <Link to="/" className="nav-brand">
            <span>🏪</span>
            <span>ShopKeeper<span className="highlight">AI</span></span>
          </Link>
          <div className="nav-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help</Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              </>
            )}
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">🚀 100% Free • No Credit Card Required</div>
          <h1>
            Manage Your Shop with <span className="gradient-text">AI Power</span>
          </h1>
          <p className="hero-subtitle">
            The smartest assistant for small shopkeepers. Track sales, manage inventory, 
            create invoices, and get insights - all with simple voice-like commands.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              <span>✨</span> Start Free Today
            </Link>
            <Link to="/help" className="btn btn-secondary btn-lg">
              <span>📖</span> See How It Works
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Shopkeepers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Invoices Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-demo">
          <div className="demo-window">
            <div className="demo-header">
              <span className="demo-dot red"></span>
              <span className="demo-dot yellow"></span>
              <span className="demo-dot green"></span>
              <span className="demo-title">ShopKeeperAI Chat</span>
            </div>
            <div className="demo-content">
              <div className="demo-message user">
                <span>Sold 5kg rice at 80</span>
              </div>
              <div className="demo-message bot">
                <span>✅ Sale recorded!</span>
                <div className="demo-data">
                  <div>📦 Product: rice</div>
                  <div>📊 Quantity: 5kg</div>
                  <div>💰 Price: Rs.80/-</div>
                  <div>💵 Total: Rs.400/-</div>
                </div>
              </div>
              <div className="demo-message user">
                <span>Today's summary</span>
              </div>
              <div className="demo-message bot">
                <span>📊 Daily Summary</span>
                <div className="demo-data">
                  <div>💰 Sales: Rs.12,500/-</div>
                  <div>📈 Profit: Rs.2,800/-</div>
                  <div>🏆 Top: Rice (25 sold)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2>Everything You Need to Run Your Shop</h2>
            <p>Powerful tools designed specifically for small retail businesses</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Natural Language Commands</h3>
              <p>Just type like you talk. Say "Sold 10 pens at 15" - no complex forms needed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Smart Inventory</h3>
              <p>Automatic stock tracking with low-stock alerts. Never run out of products.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Quick Invoices</h3>
              <p>Create professional invoices in seconds. Print or share digitally.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Daily Reports</h3>
              <p>Know your profits, top sellers, and trends at a glance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Urdu Translation</h3>
              <p>Translate supplier bills from English to Urdu instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Suggestions</h3>
              <p>AI-powered reorder alerts and pricing recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2>Start in 3 Simple Steps</h2>
            <p>No technical knowledge required</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up for free with your email. No credit card needed.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Start Chatting</h3>
              <p>Type commands like "Bought 50 pens at 10 each" to add inventory.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Track & Grow</h3>
              <p>View reports, manage stock, and grow your business with insights.</p>
            </div>
          </div>

          <div className="cta-box">
            <h3>Ready to Transform Your Shop?</h3>
            <p>Join thousands of shopkeepers already using ShopKeeperAI</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span>🏪</span>
                <span>ShopKeeper<span className="highlight">AI</span></span>
              </div>
              <p>AI-powered assistant for small shopkeepers. Built with modern technology for the digital age of retail.</p>
              <div className="footer-social">
                <a href="https://www.linkedin.com/in/muhammad-hamza-khattak/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <span>💼</span>
                </a>
                <a href="mailto:mr.hamxa942@gmail.com" title="Email">
                  <span>📧</span>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <Link to="/help">How It Works</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-links">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-links">
              <h4>Developer</h4>
              <a href="https://www.linkedin.com/in/muhammad-hamza-khattak/" target="_blank" rel="noopener noreferrer">Muhammad Hamza</a>
              <a href="mailto:mr.hamxa942@gmail.com">mr.hamxa942@gmail.com</a>
              <Link to="/contact">Contact Support</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 ShopKeeperAI. Developed by <a href="https://www.linkedin.com/in/muhammad-hamza-khattak/" target="_blank" rel="noopener noreferrer">Muhammad Hamza Khattak</a></p>
            <p className="footer-tagline">Made with ❤️ for small businesses in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;


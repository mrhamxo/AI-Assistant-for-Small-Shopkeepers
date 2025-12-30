import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <nav className="page-nav">
        <Link to="/" className="nav-brand">
          <span>🏪</span>
          <span>ShopKeeper<span className="highlight">AI</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/help">Help</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </nav>

      <main className="about-content">
        <div className="container">
          <div className="about-header">
            <span className="page-badge">About Us</span>
            <h1>Empowering Small Businesses with AI</h1>
            <p>We believe every shopkeeper deserves powerful tools to grow their business</p>
          </div>

          <div className="about-grid">
            <div className="about-card mission">
              <div className="card-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                To make business management simple and accessible for every small shopkeeper, 
                regardless of their technical background. We're bridging the technology gap 
                with AI-powered solutions that speak your language.
              </p>
            </div>

            <div className="about-card vision">
              <div className="card-icon">🌟</div>
              <h2>Our Vision</h2>
              <p>
                A world where small businesses have access to the same powerful tools as 
                large corporations. We envision every neighborhood shop thriving with 
                smart inventory, clear insights, and effortless operations.
              </p>
            </div>
          </div>

          <div className="values-section">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              <div className="value-item">
                <span className="value-icon">💯</span>
                <h3>100% Free</h3>
                <p>No hidden fees, no premium tiers. All features are free forever.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🔒</span>
                <h3>Privacy First</h3>
                <p>Your data stays on your device. We never sell or share your information.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🤝</span>
                <h3>Simple by Design</h3>
                <p>No training needed. If you can talk, you can use ShopKeeperAI.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🌍</span>
                <h3>Local Language</h3>
                <p>Built for Pakistani shopkeepers with Urdu support and local context.</p>
              </div>
            </div>
          </div>

          <div className="tech-section">
            <h2>Built with Modern Technology</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <span>⚡</span>
                <span>FastAPI</span>
              </div>
              <div className="tech-item">
                <span>⚛️</span>
                <span>React</span>
              </div>
              <div className="tech-item">
                <span>🤖</span>
                <span>Groq AI</span>
              </div>
              <div className="tech-item">
                <span>🗄️</span>
                <span>SQLite</span>
              </div>
              <div className="tech-item">
                <span>🔐</span>
                <span>JWT Auth</span>
              </div>
              <div className="tech-item">
                <span>🌐</span>
                <span>Helsinki NLP</span>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of shopkeepers already using ShopKeeperAI</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <p>© 2024 ShopKeeperAI. Made with ❤️ for small businesses.</p>
      </footer>
    </div>
  );
}

export default About;


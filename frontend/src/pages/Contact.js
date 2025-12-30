import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <nav className="page-nav">
        <Link to="/" className="nav-brand">
          <span>🏪</span>
          <span>ShopKeeper<span className="highlight">AI</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/help">Help</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </nav>

      <main className="contact-content">
        <div className="container">
          <div className="contact-header">
            <span className="page-badge">Contact Us</span>
            <h1>Get in Touch</h1>
            <p>Have questions? We'd love to hear from you.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-card">
                <span className="info-icon">📧</span>
                <h3>Email</h3>
                <p>support@shopkeeperai.com</p>
                <p>info@shopkeeperai.com</p>
              </div>

              <div className="info-card">
                <span className="info-icon">📞</span>
                <h3>Phone</h3>
                <p>+92 300 1234567</p>
                <p>Mon-Sat: 9AM - 6PM</p>
              </div>

              <div className="info-card">
                <span className="info-icon">📍</span>
                <h3>Location</h3>
                <p>Lahore, Pakistan</p>
                <p>Serving shopkeepers nationwide</p>
              </div>

              <div className="info-card">
                <span className="info-icon">💬</span>
                <h3>Social</h3>
                <div className="social-links">
                  <a href="#" aria-label="WhatsApp">📱 WhatsApp</a>
                  <a href="#" aria-label="Facebook">📘 Facebook</a>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              {submitted ? (
                <div className="success-message">
                  <span className="success-icon">✅</span>
                  <h2>Message Sent!</h2>
                  <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h2>Send us a Message</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className="input"
                      rows={5}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg">
                    <span>📤</span> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Is ShopKeeperAI really free?</h3>
                <p>Yes! All features are 100% free. No hidden fees, no premium tiers.</p>
              </div>
              <div className="faq-item">
                <h3>Do I need technical skills?</h3>
                <p>No. If you can type or talk, you can use ShopKeeperAI.</p>
              </div>
              <div className="faq-item">
                <h3>Is my data safe?</h3>
                <p>Yes. Your data is stored locally and encrypted. We never share it.</p>
              </div>
              <div className="faq-item">
                <h3>Can I use it on mobile?</h3>
                <p>Yes! ShopKeeperAI works on any device with a web browser.</p>
              </div>
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

export default Contact;


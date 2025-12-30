import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use URLSearchParams for proper form-urlencoded format
      const params = new URLSearchParams();
      params.append('username', formData.email);
      params.append('password', formData.password);

      const response = await api.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-pattern"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🏪</span>
              <h1>ShopKeeper<span className="logo-highlight">AI</span></h1>
            </div>
            <p className="auth-subtitle">Welcome back! Sign in to your account</p>
          </div>

          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
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
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/signup" className="auth-link">Create Account →</Link>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Admin Account:</p>
            <code>admin@shopkeeper.com / admin123</code>
          </div>
        </div>

        <div className="auth-features">
          <h2>Manage Your Shop with AI</h2>
          <ul className="features-list">
            <li>
              <span className="feature-icon">💬</span>
              <div>
                <strong>Natural Language Commands</strong>
                <p>Just type "Sold 5 items" - we understand</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <div>
                <strong>Smart Reports</strong>
                <p>Daily summaries and profit tracking</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📦</span>
              <div>
                <strong>Inventory Alerts</strong>
                <p>Never run out of stock again</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🌐</span>
              <div>
                <strong>Urdu Translation</strong>
                <p>Translate supplier bills instantly</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = user?.role === 'admin' 
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: '💬' },
        { path: '/admin', label: 'Admin Panel', icon: '⚙️' },
      ]
    : [
        { path: '/dashboard', label: 'Chat', icon: '💬' },
        { path: '/inventory', label: 'Inventory', icon: '📦' },
        { path: '/invoices', label: 'Invoices', icon: '📄' },
        { path: '/reports', label: 'Reports', icon: '📊' },
      ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">ShopKeeper<span className="brand-highlight">AI</span></span>
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-user">
            <Link to="/help" className="help-link" title="Help">
              <span>❓</span>
            </Link>
            <ProfileDropdown />
          </div>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

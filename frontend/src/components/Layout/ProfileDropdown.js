import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfileDropdown.css';

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    // Clear chat history from session
    sessionStorage.removeItem('chatHistory');
    logout();
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = user?.role === 'admin' ? [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '⚙️', label: 'Admin Panel', path: '/admin' },
    { divider: true },
    { icon: '👤', label: 'Profile', path: '/settings/profile' },
    { icon: '🔧', label: 'Settings', path: '/settings' },
    { divider: true },
    { icon: '📖', label: 'Help', path: '/help' },
  ] : [
    { icon: '💬', label: 'Chat', path: '/dashboard' },
    { icon: '📦', label: 'Inventory', path: '/inventory' },
    { icon: '📄', label: 'Invoices', path: '/invoices' },
    { icon: '📊', label: 'Reports', path: '/reports' },
    { divider: true },
    { icon: '👤', label: 'Profile', path: '/settings/profile' },
    { icon: '🔧', label: 'Settings', path: '/settings' },
    { divider: true },
    { icon: '📖', label: 'Help', path: '/help' },
  ];

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name || 'User'}</span>
          <span className="profile-role">{user?.shop_name || user?.role}</span>
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="header-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="header-info">
              <span className="header-name">{user?.name}</span>
              <span className="header-email">{user?.email}</span>
              <span className={`header-badge ${user?.role}`}>{user?.role}</span>
            </div>
          </div>

          <div className="dropdown-items">
            {menuItems.map((item, idx) => (
              item.divider ? (
                <div key={idx} className="dropdown-divider"></div>
              ) : (
                <Link 
                  key={idx}
                  to={item.path}
                  className="dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-label">{item.label}</span>
                </Link>
              )
            ))}
          </div>

          <div className="dropdown-footer">
            <button onClick={handleLogoutClick} className="logout-button">
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">🚪</div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to sign out of your account?</p>
            <div className="logout-modal-actions">
              <button 
                className="btn-cancel"
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button 
                className="btn-logout"
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;


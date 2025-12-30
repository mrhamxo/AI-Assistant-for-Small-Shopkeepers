import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Settings.css';

function Settings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    shop_name: user?.shop_name || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would update the profile via API
      // For now, we'll just update localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(localStorage.getItem('token'), updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would update password via API
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="settings-page">
        <div className="page-header">
          <div className="header-content">
            <h1>⚙️ Settings</h1>
            <p>Manage your account and preferences</p>
          </div>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            <button 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>👤</span> Profile
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span>🔒</span> Security
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <span>🎨</span> Preferences
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span>🔔</span> Notifications
            </button>
          </div>

          <div className="settings-content">
            {message.text && (
              <div className={`settings-message ${message.type}`}>
                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <p className="section-description">Update your personal information</p>
                
                <form onSubmit={handleProfileSubmit} className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="input"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="input"
                      placeholder="you@example.com"
                      disabled
                    />
                    <span className="input-hint">Email cannot be changed</span>
                  </div>

                  <div className="form-group">
                    <label>Shop Name</label>
                    <input
                      type="text"
                      name="shop_name"
                      value={profileData.shop_name}
                      onChange={handleProfileChange}
                      className="input"
                      placeholder="Your shop name"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Change Password</h2>
                <p className="section-description">Keep your account secure with a strong password</p>
                
                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      className="input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className="input"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      className="input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2>Preferences</h2>
                <p className="section-description">Customize your experience</p>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Dark Mode</h3>
                    <p>Use dark theme (currently enabled)</p>
                  </div>
                  <div className="toggle-switch active">
                    <span className="toggle-slider"></span>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Sound Effects</h3>
                    <p>Play sounds for notifications</p>
                  </div>
                  <div className="toggle-switch">
                    <span className="toggle-slider"></span>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Currency</h3>
                    <p>Default currency for transactions</p>
                  </div>
                  <select className="input preference-select">
                    <option value="PKR">Rs. PKR (Pakistani Rupee)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="INR">₹ INR (Indian Rupee)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notifications</h2>
                <p className="section-description">Manage your notification preferences</p>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Low Stock Alerts</h3>
                    <p>Get notified when products are running low</p>
                  </div>
                  <div className="toggle-switch active">
                    <span className="toggle-slider"></span>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Daily Summary</h3>
                    <p>Receive daily sales summary</p>
                  </div>
                  <div className="toggle-switch active">
                    <span className="toggle-slider"></span>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                  <div className="toggle-switch">
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;


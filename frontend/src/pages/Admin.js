import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Admin.css';

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data.users || []);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.post(`/admin/users/${userId}/toggle`);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => u.is_active).length;
  const shopkeepers = users.filter(u => u.role === 'shopkeeper').length;
  const admins = users.filter(u => u.role === 'admin').length;

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="admin-page">
          <div className="access-denied">
            <span>🔒</span>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-page">
        <div className="page-header">
          <div className="header-content">
            <h1>⚙️ Admin Panel</h1>
            <p>Manage users, view statistics, and monitor system health</p>
          </div>
          <button className="btn btn-primary" onClick={fetchData}>
            🔄 Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span>❌</span>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="admin-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Users ({users.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                📋 Activity Log
              </button>
              <button 
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                🔧 System Settings
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="admin-overview">
                <div className="stats-grid">
                  <div className="stat-card primary">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <span className="stat-value">{stats?.total_users || 0}</span>
                      <span className="stat-label">Total Users</span>
                    </div>
                    <div className="stat-meta">
                      <span className="meta-item positive">+{activeUsers} active</span>
                    </div>
                  </div>

                  <div className="stat-card success">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                      <span className="stat-value">{stats?.total_products || 0}</span>
                      <span className="stat-label">Total Products</span>
                    </div>
                  </div>

                  <div className="stat-card warning">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                      <span className="stat-value">{stats?.total_sales || 0}</span>
                      <span className="stat-label">Total Sales</span>
                    </div>
                  </div>

                  <div className="stat-card info">
                    <div className="stat-icon">📄</div>
                    <div className="stat-content">
                      <span className="stat-value">{stats?.total_invoices || 0}</span>
                      <span className="stat-label">Total Invoices</span>
                    </div>
                  </div>
                </div>

                <div className="overview-grid">
                  <div className="overview-card">
                    <h3>👥 User Distribution</h3>
                    <div className="distribution-list">
                      <div className="distribution-item">
                        <span className="dist-label">Shopkeepers</span>
                        <div className="dist-bar">
                          <div 
                            className="dist-fill shopkeeper" 
                            style={{ width: `${users.length > 0 ? (shopkeepers / users.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="dist-value">{shopkeepers}</span>
                      </div>
                      <div className="distribution-item">
                        <span className="dist-label">Administrators</span>
                        <div className="dist-bar">
                          <div 
                            className="dist-fill admin" 
                            style={{ width: `${users.length > 0 ? (admins / users.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="dist-value">{admins}</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <h3>🏥 System Health</h3>
                    <div className="health-list">
                      <div className="health-item">
                        <span className="health-status active"></span>
                        <span>API Server</span>
                        <span className="health-badge success">Healthy</span>
                      </div>
                      <div className="health-item">
                        <span className="health-status active"></span>
                        <span>Database</span>
                        <span className="health-badge success">Connected</span>
                      </div>
                      <div className="health-item">
                        <span className="health-status active"></span>
                        <span>AI Service</span>
                        <span className="health-badge success">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card full-width">
                    <h3>📈 Recent Activity</h3>
                    <div className="activity-list">
                      {users.slice(0, 5).map((u, idx) => (
                        <div key={idx} className="activity-item">
                          <div className="activity-avatar">{u.name?.charAt(0)}</div>
                          <div className="activity-content">
                            <span className="activity-user">{u.name}</span>
                            <span className="activity-action">registered on {new Date(u.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className={`activity-badge ${u.role}`}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="users-header">
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="user-stats">
                    <span className="badge badge-success">{activeUsers} Active</span>
                    <span className="badge badge-danger">{users.length - activeUsers} Inactive</span>
                  </div>
                </div>

                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Shop Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-cell">
                              <span className="user-avatar">
                                {u.name?.charAt(0)?.toUpperCase()}
                              </span>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.shop_name || '-'}</td>
                          <td>
                            <span className={`badge badge-${u.role === 'admin' ? 'primary' : 'success'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-dot ${u.is_active ? 'active' : 'inactive'}`}></span>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              {u.id !== user.id && (
                                <button
                                  className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                                  onClick={() => toggleUserStatus(u.id, u.is_active)}
                                >
                                  {u.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-section">
                <div className="activity-log">
                  <h3>📋 System Activity Log</h3>
                  <div className="log-list">
                    <div className="log-item">
                      <span className="log-time">Just now</span>
                      <span className="log-icon">👁️</span>
                      <span className="log-message">Admin panel accessed by {user.name}</span>
                    </div>
                    {users.slice(0, 8).map((u, idx) => (
                      <div key={idx} className="log-item">
                        <span className="log-time">{new Date(u.created_at).toLocaleDateString()}</span>
                        <span className="log-icon">👤</span>
                        <span className="log-message">New user registered: {u.name} ({u.email})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="system-settings">
                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>🔐 Security Settings</h3>
                    <div className="setting-item">
                      <span>Session Timeout</span>
                      <select className="input">
                        <option>30 days</option>
                        <option>7 days</option>
                        <option>1 day</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <span>Require Strong Passwords</span>
                      <div className="toggle-switch active">
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>📧 Notification Settings</h3>
                    <div className="setting-item">
                      <span>Email Notifications</span>
                      <div className="toggle-switch active">
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <span>New User Alerts</span>
                      <div className="toggle-switch active">
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>🗄️ Database</h3>
                    <div className="setting-info">
                      <p><strong>Type:</strong> SQLite</p>
                      <p><strong>Size:</strong> {stats ? '~1 MB' : 'Unknown'}</p>
                      <p><strong>Status:</strong> <span className="badge badge-success">Healthy</span></p>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>🤖 AI Configuration</h3>
                    <div className="setting-info">
                      <p><strong>Provider:</strong> Groq API</p>
                      <p><strong>Model:</strong> LLaMA 3.1 8B</p>
                      <p><strong>Status:</strong> <span className="badge badge-success">Active</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Admin;

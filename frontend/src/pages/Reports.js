import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Reports.css';

function Reports() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await api.get('/summary');
      setSummary(response.data);
    } catch (err) {
      setError('Failed to load report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const profitMargin = summary?.total_sales > 0 
    ? ((summary.total_profit / summary.total_sales) * 100).toFixed(1)
    : 0;

  const formatCurrency = (amount) => {
    return `Rs.${(amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}/-`;
  };

  return (
    <Layout>
      <div className="reports-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-title">
              <h1>📊 Sales Reports & Analytics</h1>
              <p>Performance overview for <strong>{user?.shop_name}</strong> • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={fetchSummary}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your reports...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span>❌</span>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchSummary}>Try Again</button>
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="main-stats">
              <div className="main-stat-card sales">
                <div className="stat-header">
                  <span className="stat-icon">💰</span>
                  <span className="stat-badge">Today</span>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{formatCurrency(summary?.total_sales)}</span>
                  <span className="stat-label">Total Sales</span>
                </div>
                <div className="stat-footer">
                  <div className="mini-chart">
                    <svg viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points="0,25 15,20 30,22 45,15 60,18 75,10 100,5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="main-stat-card profit">
                <div className="stat-header">
                  <span className="stat-icon">📈</span>
                  <span className="stat-badge positive">+{profitMargin}%</span>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{formatCurrency(summary?.total_profit)}</span>
                  <span className="stat-label">Net Profit</span>
                </div>
                <div className="stat-footer">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, profitMargin * 3)}%` }}
                    ></div>
                  </div>
                  <span className="progress-label">{profitMargin}% margin</span>
                </div>
              </div>

              <div className="main-stat-card items">
                <div className="stat-header">
                  <span className="stat-icon">🛒</span>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{summary?.total_items_sold || 0}</span>
                  <span className="stat-label">Items Sold</span>
                </div>
                <div className="stat-footer">
                  <span className="stat-detail">
                    Avg: {formatCurrency(summary?.total_items_sold > 0 ? summary?.total_sales / summary?.total_items_sold : 0)}/item
                  </span>
                </div>
              </div>

              <div className="main-stat-card transactions">
                <div className="stat-header">
                  <span className="stat-icon">🧾</span>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{summary?.top_selling_items?.length || 0}</span>
                  <span className="stat-label">Unique Products</span>
                </div>
                <div className="stat-footer">
                  <span className="stat-detail">sold today</span>
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="analytics-grid">
              {/* Top Selling Items */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>🏆 Top Selling Products</h3>
                  <span className="card-subtitle">By quantity sold</span>
                </div>
                <div className="card-content">
                  {summary?.top_selling_items?.length > 0 ? (
                    <div className="top-items-list">
                      {summary.top_selling_items.map((item, idx) => (
                        <div key={idx} className="top-item">
                          <div className="item-rank">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </div>
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <div className="item-bar-wrapper">
                              <div 
                                className="item-bar" 
                                style={{ 
                                  width: `${(item.quantity / (summary.top_selling_items[0]?.quantity || 1)) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="item-stats">
                            <span className="item-qty">{item.quantity} units</span>
                            <span className="item-revenue">{formatCurrency(item.revenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-section">
                      <span>📊</span>
                      <p>No sales data yet today</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="analytics-card alerts">
                <div className="card-header">
                  <h3>⚠️ Low Stock Alerts</h3>
                  <span className="card-subtitle">{summary?.low_stock_items?.length || 0} items need attention</span>
                </div>
                <div className="card-content">
                  {summary?.low_stock_items?.length > 0 ? (
                    <div className="alert-list">
                      {summary.low_stock_items.map((item, idx) => (
                        <div key={idx} className="alert-item">
                          <span className="alert-icon">
                            {item.stock <= 0 ? '🚫' : item.stock < 10 ? '🔴' : '🟡'}
                          </span>
                          <div className="alert-info">
                            <span className="alert-name">{item.name || item}</span>
                            {item.stock !== undefined && (
                              <span className="alert-stock">
                                {item.stock <= 0 ? 'Out of stock' : `Only ${item.stock} left`}
                              </span>
                            )}
                          </div>
                          <span className="alert-badge">Reorder</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-section success">
                      <span>✅</span>
                      <p>All items are well stocked!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Insights */}
              <div className="analytics-card insights full-width">
                <div className="card-header">
                  <h3>💡 Business Insights</h3>
                  <span className="card-subtitle">AI-powered recommendations</span>
                </div>
                <div className="card-content">
                  <div className="insights-grid">
                    <div className="insight-card">
                      <div className="insight-icon">📈</div>
                      <div className="insight-content">
                        <strong>Sales Performance</strong>
                        <p>
                          {summary?.total_sales > 0 
                            ? `Today you've made ${formatCurrency(summary.total_sales)} with a healthy ${profitMargin}% profit margin. ${summary.total_profit > 1000 ? 'Excellent work!' : 'Keep pushing!'}`
                            : "Start recording sales to see your performance metrics and insights here."
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="insight-icon">🎯</div>
                      <div className="insight-content">
                        <strong>Top Performer</strong>
                        <p>
                          {summary?.top_selling_item 
                            ? `"${summary.top_selling_item}" is your bestseller today! Consider stocking up to meet demand.`
                            : "Record more sales to identify your top-performing products."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">📦</div>
                      <div className="insight-content">
                        <strong>Inventory Health</strong>
                        <p>
                          {summary?.low_stock_items?.length > 0
                            ? `${summary.low_stock_items.length} products are running low. Consider restocking soon to avoid stockouts.`
                            : "Your inventory levels look healthy! All items are well-stocked."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">💵</div>
                      <div className="insight-content">
                        <strong>Profit Optimization</strong>
                        <p>
                          {parseFloat(profitMargin) >= 20 
                            ? "Your profit margins are healthy. Keep up the good pricing strategy!"
                            : parseFloat(profitMargin) > 0
                            ? "Consider reviewing your pricing strategy. Aim for at least 20% profit margin."
                            : "Start making sales to track your profit margins."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <a href="/dashboard" className="action-card">
                  <span className="action-icon">💬</span>
                  <span className="action-label">Record Sale</span>
                </a>
                <a href="/inventory" className="action-card">
                  <span className="action-icon">📦</span>
                  <span className="action-label">Check Stock</span>
                </a>
                <a href="/invoices" className="action-card">
                  <span className="action-icon">📄</span>
                  <span className="action-label">View Invoices</span>
                </a>
                <a href="/dashboard" className="action-card">
                  <span className="action-icon">🛒</span>
                  <span className="action-label">Add Purchase</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Reports;

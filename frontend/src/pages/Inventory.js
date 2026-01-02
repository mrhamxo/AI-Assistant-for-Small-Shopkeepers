import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Inventory.css';

function Inventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/inventory');
      setInventory(response.data.inventory || []);
    } catch (err) {
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLowStock ? item.stock < 20 : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'price':
          comparison = (a.selling_price || a.cost_price) - (b.selling_price || b.cost_price);
          break;
        case 'value':
          comparison = (a.selling_price * a.stock) - (b.selling_price * b.stock);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.selling_price || item.cost_price) * Math.max(0, item.stock);
  }, 0);

  const totalCost = inventory.reduce((sum, item) => {
    return sum + item.cost_price * Math.max(0, item.stock);
  }, 0);

  const lowStockCount = inventory.filter(item => item.stock < 20).length;
  const outOfStockCount = inventory.filter(item => item.stock <= 0).length;

  const getStockStatus = (stock) => {
    if (stock <= 0) return { class: 'out', label: 'Out of Stock', icon: '❌' };
    if (stock < 10) return { class: 'critical', label: 'Critical', icon: '🔴' };
    if (stock < 20) return { class: 'low', label: 'Low Stock', icon: '🟡' };
    if (stock < 50) return { class: 'medium', label: 'Medium', icon: '🟢' };
    return { class: 'good', label: 'Well Stocked', icon: '✅' };
  };

  return (
    <Layout>
      <div className="inventory-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-title">
              <h1>📦 Inventory Management</h1>
              <p>Welcome back, <strong>{user?.name}</strong>! Here's your stock overview for <strong>{user?.shop_name}</strong></p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={fetchInventory}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card primary">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📦</span>
            </div>
            <div className="stat-content">
              <span className="stat-value">{inventory.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">💰</span>
            </div>
            <div className="stat-content">
              <span className="stat-value">Rs.{totalValue.toLocaleString()}/-</span>
              <span className="stat-label">Stock Value</span>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📈</span>
            </div>
            <div className="stat-content">
              <span className="stat-value">Rs.{(totalValue - totalCost).toLocaleString()}/-</span>
              <span className="stat-label">Potential Profit</span>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">⚠️</span>
            </div>
            <div className="stat-content">
              <span className="stat-value">{lowStockCount}</span>
              <span className="stat-label">Low Stock Items</span>
            </div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">🚫</span>
            </div>
            <div className="stat-content">
              <span className="stat-value">{outOfStockCount}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        <div className="inventory-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            <div className="filter-group">
              <label className="filter-toggle">
                <input
                  type="checkbox"
                  checked={filterLowStock}
                  onChange={(e) => setFilterLowStock(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                <span className="toggle-label">Low Stock Only</span>
              </label>
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="price">Sort by Price</option>
              <option value="value">Sort by Value</option>
            </select>

            <button 
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ▦
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your inventory...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span>❌</span>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchInventory}>Try Again</button>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No Products Found</h3>
            <p>
              {inventory.length === 0 
                ? "Start adding products by using the chat! Say \"Bought 10 pens at 20 each\""
                : "No products match your search. Try different filters."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="results-info">
              Showing {filteredInventory.length} of {inventory.length} products
            </div>
            
            {viewMode === 'grid' ? (
              <div className="inventory-grid">
                {filteredInventory.map((item, idx) => {
                  const status = getStockStatus(item.stock);
                  return (
                    <div 
                      key={idx} 
                      className={`inventory-card ${status.class}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="card-header">
                        <h3>{item.name}</h3>
                        <span className={`status-badge ${status.class}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      
                      <div className="card-stock">
                        <div className="stock-visual">
                          <div 
                            className="stock-bar" 
                            style={{ 
                              width: `${Math.min(100, (Math.max(0, item.stock) / 100) * 100)}%`,
                              background: item.stock <= 0 ? 'var(--danger)' : 
                                         item.stock < 10 ? 'var(--danger)' : 
                                         item.stock < 20 ? 'var(--warning)' : 'var(--secondary)'
                            }}
                          ></div>
                        </div>
                        <span className="stock-number">{Math.max(0, item.stock)} units</span>
                      </div>
                      
                      <div className="card-prices">
                        <div className="price-item">
                          <span className="price-label">Cost</span>
                          <span className="price-value">Rs.{item.cost_price}/-</span>
                        </div>
                        <div className="price-item highlight">
                          <span className="price-label">Selling</span>
                          <span className="price-value">Rs.{item.selling_price || item.cost_price}/-</span>
                        </div>
                        <div className="price-item profit">
                          <span className="price-label">Margin</span>
                          <span className="price-value">
                            {item.cost_price > 0 
                              ? ((((item.selling_price || item.cost_price) - item.cost_price) / item.cost_price) * 100).toFixed(0) 
                              : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <span className="stock-value">
                          Value: Rs.{((item.selling_price || item.cost_price) * Math.max(0, item.stock)).toLocaleString()}/-
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="inventory-table-container">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Stock</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Margin</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item, idx) => {
                      const status = getStockStatus(item.stock);
                      const margin = item.cost_price > 0 
                        ? ((item.selling_price || item.cost_price) - item.cost_price) / item.cost_price * 100 
                        : 0;
                      return (
                        <tr key={idx} className={status.class}>
                          <td className="product-name">{item.name}</td>
                          <td>
                            <span className={`status-badge ${status.class}`}>
                              {status.icon} {status.label}
                            </span>
                          </td>
                          <td className={`stock-cell ${status.class}`}>{Math.max(0, item.stock)}</td>
                          <td>Rs.{item.cost_price}/-</td>
                          <td className="selling-price">Rs.{item.selling_price || item.cost_price}/-</td>
                          <td className={margin > 20 ? 'good-margin' : ''}>{margin.toFixed(0)}%</td>
                          <td className="value-cell">Rs.{((item.selling_price || item.cost_price) * Math.max(0, item.stock)).toLocaleString()}/-</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Inventory;

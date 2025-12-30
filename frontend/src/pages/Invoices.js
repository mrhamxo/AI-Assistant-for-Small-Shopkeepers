import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Invoices.css';

function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices || []);
    } catch (err) {
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const parseItems = (itemsString) => {
    try {
      return JSON.parse(itemsString);
    } catch {
      return [];
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const avgOrderValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="invoices-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-title">
              <h1>📄 Invoice Management</h1>
              <p>All invoices for <strong>{user?.shop_name}</strong></p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={fetchInvoices}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card mini">
            <span className="stat-icon">📄</span>
            <div>
              <span className="stat-value">{invoices.length}</span>
              <span className="stat-label">Total Invoices</span>
            </div>
          </div>
          <div className="stat-card mini">
            <span className="stat-icon">💰</span>
            <div>
              <span className="stat-value">Rs.{totalRevenue.toLocaleString()}/-</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
          <div className="stat-card mini">
            <span className="stat-icon">📊</span>
            <div>
              <span className="stat-value">Rs.{avgOrderValue.toFixed(0)}/-</span>
              <span className="stat-label">Avg Order Value</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading invoices...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span>❌</span>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchInvoices}>Try Again</button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📄</span>
            <h3>No Invoices Yet</h3>
            <p>Create your first invoice by using the chat. Try saying "Invoice for Ahmed: 5 rice at 80"</p>
          </div>
        ) : (
          <div className="invoices-layout">
            <div className="invoices-sidebar">
              <div className="sidebar-header">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="invoices-list">
                {filteredInvoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className={`invoice-item ${selectedInvoice?.id === invoice.id ? 'active' : ''}`}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="invoice-item-left">
                      <span className="invoice-date">{formatShortDate(invoice.date)}</span>
                      <span className="invoice-customer">
                        {invoice.customer_name || 'Walk-in Customer'}
                      </span>
                    </div>
                    <div className="invoice-item-right">
                      <span className="invoice-amount">Rs.{invoice.total_amount.toFixed(0)}/-</span>
                      <span className="invoice-number">{invoice.invoice_number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="invoice-preview">
              {selectedInvoice ? (
                <div className="invoice-document">
                  <div className="invoice-header">
                    <div className="invoice-brand">
                      <span className="brand-icon">🏪</span>
                      <div>
                        <h2>{user?.shop_name || 'ShopKeeperAI'}</h2>
                        <p className="brand-subtitle">Smart Shop Management</p>
                      </div>
                    </div>
                    <div className="invoice-meta">
                      <div className="invoice-badge">INVOICE</div>
                      <p className="invoice-id">{selectedInvoice.invoice_number}</p>
                      <p className="invoice-date-full">{formatDate(selectedInvoice.date)}</p>
                    </div>
                  </div>

                  <div className="invoice-parties">
                    <div className="party-block">
                      <span className="party-label">Bill From</span>
                      <span className="party-name">{user?.shop_name || 'Your Shop'}</span>
                      <span className="party-detail">{user?.email}</span>
                    </div>
                    <div className="party-block">
                      <span className="party-label">Bill To</span>
                      <span className="party-name">{selectedInvoice.customer_name || 'Walk-in Customer'}</span>
                    </div>
                  </div>

                  <div className="invoice-items-section">
                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Item Description</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseItems(selectedInvoice.items).map((item, idx) => (
                          <tr key={idx}>
                            <td className="row-num">{idx + 1}</td>
                            <td className="item-desc">{item.name}</td>
                            <td className="item-qty">{item.quantity}</td>
                            <td className="item-price">Rs.{item.price}/-</td>
                            <td className="item-amount">Rs.{(item.quantity * item.price).toFixed(0)}/-</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="invoice-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>Rs.{selectedInvoice.total_amount.toFixed(2)}/-</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (0%)</span>
                      <span>Rs.0.00/-</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>Rs.{selectedInvoice.total_amount.toFixed(2)}/-</span>
                    </div>
                  </div>

                  <div className="invoice-footer">
                    <div className="footer-note">
                      <p>Thank you for your business!</p>
                      <p className="footer-subtitle">Generated by ShopKeeperAI</p>
                    </div>
                    <button className="btn btn-primary print-btn" onClick={handlePrint}>
                      🖨️ Print Invoice
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-selection">
                  <span className="selection-icon">📄</span>
                  <h3>Select an Invoice</h3>
                  <p>Click on an invoice from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Invoices;

import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message }) {
  const { type, text, data, error, timestamp } = message;
  const isBot = type === 'bot';

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderData = () => {
    if (!data) return null;

    if (data.invoice_number) {
      return (
        <div className="message-data invoice-data">
          <div className="data-header">
            <span className="data-icon">📄</span>
            <span className="data-title">Invoice Created</span>
          </div>
          <div className="data-content">
            <div className="data-row">
              <span className="data-label">Invoice #</span>
              <span className="data-value">{data.invoice_number}</span>
            </div>
            {data.customer_name && (
              <div className="data-row">
                <span className="data-label">Customer</span>
                <span className="data-value">{data.customer_name}</span>
              </div>
            )}
            <div className="data-row total">
              <span className="data-label">Total</span>
              <span className="data-value">Rs.{data.total_amount?.toFixed(2)}/-</span>
            </div>
          </div>
        </div>
      );
    }

    if (Array.isArray(data) && data.length > 0 && data[0].name) {
      // Inventory data
      return (
        <div className="message-data inventory-data">
          <div className="data-header">
            <span className="data-icon">📦</span>
            <span className="data-title">Inventory ({data.length} items)</span>
          </div>
          <div className="data-table">
            <div className="table-header">
              <span>Product</span>
              <span>Stock</span>
              <span>Price</span>
            </div>
            {data.slice(0, 5).map((item, idx) => (
              <div key={idx} className="table-row">
                <span>{item.name}</span>
                <span className={item.stock < 10 ? 'low-stock' : ''}>{item.stock}</span>
                <span>Rs.{item.selling_price || item.cost_price}/-</span>
              </div>
            ))}
            {data.length > 5 && (
              <div className="table-more">+{data.length - 5} more items</div>
            )}
          </div>
        </div>
      );
    }

    if (data.total_sales !== undefined) {
      // Summary data
      return (
        <div className="message-data summary-data">
          <div className="data-header">
            <span className="data-icon">📊</span>
            <span className="data-title">Daily Summary</span>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-value">Rs.{data.total_sales?.toFixed(2)}/-</span>
              <span className="summary-label">Total Sales</span>
            </div>
            <div className="summary-item profit">
              <span className="summary-value">Rs.{data.total_profit?.toFixed(2)}/-</span>
              <span className="summary-label">Profit</span>
            </div>
            {data.top_selling_item && (
              <div className="summary-item">
                <span className="summary-value">{data.top_selling_item}</span>
                <span className="summary-label">Top Seller</span>
              </div>
            )}
          </div>
          {data.low_stock_items?.length > 0 && (
            <div className="low-stock-warning">
              ⚠️ Low stock: {data.low_stock_items.join(', ')}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`chat-message ${type} ${error ? 'error' : ''} fade-in`}>
      {isBot && (
        <div className="message-avatar bot-avatar">
          <span>🤖</span>
        </div>
      )}
      <div className="message-wrapper">
        <div className="message-bubble">
          <div className="message-text">{text}</div>
          {renderData()}
        </div>
        {timestamp && (
          <div className="message-time">{formatTime(timestamp)}</div>
        )}
      </div>
      {!isBot && (
        <div className="message-avatar user-avatar">
          <span>👤</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;


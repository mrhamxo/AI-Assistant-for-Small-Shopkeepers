import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import WelcomeModal from '../components/Onboarding/WelcomeModal';
import api from '../services/api';
import './Dashboard.css';

const WELCOME_MESSAGE = {
  type: 'bot',
  text: "👋 Welcome to ShopKeeperAI! I'm your intelligent shop assistant.\n\nI can help you with:\n• Recording sales and purchases\n• Managing inventory\n• Creating invoices\n• Daily summaries and reports\n• Reorder suggestions\n• Translating bills to Urdu\n\nTry typing something like \"Sold 5kg rice at 80\" or \"Show my inventory\"",
  timestamp: new Date().toISOString()
};

function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [stockNotifications, setStockNotifications] = useState(null);
  const [messages, setMessages] = useState(() => {
    // Load chat history from sessionStorage
    const savedHistory = sessionStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
    return [WELCOME_MESSAGE];
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      setShowWelcome(true);
    }
    
    // Fetch low stock notifications
    fetchStockNotifications();
  }, []);

  const fetchStockNotifications = async () => {
    try {
      const response = await api.get('/notifications/low-stock');
      setStockNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch stock notifications:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    const userMessage = {
      type: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: text });
      const data = response.data;
      
      const botMessage = {
        type: 'bot',
        text: data.response || data.message,
        data: data.data || null,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Refresh stock notifications if the message might have affected inventory
      const lowerText = text.toLowerCase();
      if (lowerText.includes('sold') || lowerText.includes('invoice') || lowerText.includes('sale') || lowerText.includes('bought')) {
        fetchStockNotifications();
      }
    } catch (err) {
      const errorMessage = {
        type: 'bot',
        text: err.response?.data?.detail || 'Sorry, something went wrong. Please try again.',
        error: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <div className="dashboard">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-status"></span>
              <div>
                <h2>AI Assistant</h2>
                <p>Always ready to help</p>
              </div>
            </div>
            <div className="chat-actions">
              <button 
                className="btn btn-ghost btn-icon"
                onClick={() => {
                  setMessages([WELCOME_MESSAGE]);
                  sessionStorage.removeItem('chatHistory');
                }}
                title="Clear chat"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {loading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>

        <aside className="dashboard-sidebar">
          {stockNotifications && stockNotifications.total_alerts > 0 && (
            <div className="sidebar-section notifications-section">
              <h3>⚠️ Stock Alerts</h3>
              <div className="stock-alerts">
                {stockNotifications.out_of_stock.length > 0 && (
                  <div className="alert-group out-of-stock">
                    <h4>🚫 Out of Stock ({stockNotifications.out_of_stock.length})</h4>
                    <ul>
                      {stockNotifications.out_of_stock.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="alert-item critical">
                          <span className="item-name">{item.name}</span>
                          <span className="item-stock">0 units</span>
                        </li>
                      ))}
                      {stockNotifications.out_of_stock.length > 5 && (
                        <li className="more-items">+{stockNotifications.out_of_stock.length - 5} more items</li>
                      )}
                    </ul>
                  </div>
                )}
                {stockNotifications.low_stock.length > 0 && (
                  <div className="alert-group low-stock">
                    <h4>⚡ Low Stock ({stockNotifications.low_stock.length})</h4>
                    <ul>
                      {stockNotifications.low_stock.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="alert-item warning">
                          <span className="item-name">{item.name}</span>
                          <span className="item-stock">{item.stock} units</span>
                        </li>
                      ))}
                      {stockNotifications.low_stock.length > 5 && (
                        <li className="more-items">+{stockNotifications.low_stock.length - 5} more items</li>
                      )}
                    </ul>
                  </div>
                )}
                <button 
                  className="btn btn-ghost btn-sm refresh-btn"
                  onClick={fetchStockNotifications}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          )}
          
          <div className="sidebar-section">
            <h3>💡 Quick Tips</h3>
            <ul className="tips-list">
              <li>
                <strong>Record Sale:</strong>
                <code>"Sold 10 pens at 15 each"</code>
              </li>
              <li>
                <strong>Record Purchase:</strong>
                <code>"Bought 50 notebooks at 25"</code>
              </li>
              <li>
                <strong>Create Invoice:</strong>
                <code>"Invoice for Ahmed: 5 rice at 80"</code>
              </li>
              <li>
                <strong>Check Inventory:</strong>
                <code>"Show my inventory"</code>
              </li>
              <li>
                <strong>Daily Summary:</strong>
                <code>"Today's sales summary"</code>
              </li>
              <li>
                <strong>Reorder Items:</strong>
                <code>"What should I reorder?"</code>
              </li>
            </ul>
          </div>

          <div className="sidebar-section stats-section">
            <h3>📊 Quick Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{messages.length - 1}</span>
                <span className="stat-label">Messages</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section translate-section">
            <h3>🌐 Translate Bill</h3>
            <p>Paste English bill text below to translate to Urdu:</p>
            <TranslateWidget />
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function TranslateWidget() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/translate', { text });
      setTranslation(response.data.translated_text);
    } catch (err) {
      setTranslation('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translate-widget">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter English text..."
        className="translate-input"
        rows={3}
      />
      <button 
        onClick={handleTranslate} 
        className="btn btn-secondary btn-sm"
        disabled={loading || !text.trim()}
      >
        {loading ? 'Translating...' : 'Translate to Urdu'}
      </button>
      {translation && (
        <div className="translation-result">
          <p className="urdu-text" dir="rtl">{translation}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

function Help() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const commands = [
    { category: 'Sales', examples: [
      { command: 'Sold 5kg rice at 80', description: 'Record a sale of 5kg rice at ₹80 per kg' },
      { command: 'Sold 10 pens at 15 each', description: 'Record sale of 10 pens at ₹15 each' },
      { command: '3 notebooks sold for 50', description: 'Record sale of 3 notebooks at ₹50 each' },
    ]},
    { category: 'Purchases', examples: [
      { command: 'Bought 50 pens at 10', description: 'Add 50 pens to inventory at ₹10 cost' },
      { command: 'Purchased 20kg sugar at 60', description: 'Add 20kg sugar to stock' },
      { command: 'Restocked 100 notebooks at 30', description: 'Restock notebooks' },
    ]},
    { category: 'Invoices', examples: [
      { command: 'Invoice for Ahmed: 5 rice at 80, 2 oil at 150', description: 'Create invoice with multiple items' },
      { command: 'Bill for Khan sahab: 10 pens at 15', description: 'Create invoice for customer' },
    ]},
    { category: 'Reports', examples: [
      { command: 'Today summary', description: 'Get today\'s sales summary' },
      { command: 'Show daily report', description: 'View daily sales and profit' },
      { command: 'What are my sales?', description: 'Check current sales' },
    ]},
    { category: 'Inventory', examples: [
      { command: 'Show inventory', description: 'View all products and stock' },
      { command: 'Check stock', description: 'See current inventory levels' },
      { command: 'What should I reorder?', description: 'Get low stock alerts' },
    ]},
    { category: 'Pricing', examples: [
      { command: 'What price for rice?', description: 'Get price recommendation' },
      { command: 'Suggest price for pens', description: 'AI pricing suggestion' },
    ]},
  ];

  return (
    <div className="help-page">
      <nav className="page-nav">
        <Link to="/" className="nav-brand">
          <span>🏪</span>
          <span>ShopKeeper<span className="highlight">AI</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </nav>

      <main className="help-content">
        <div className="container">
          <div className="help-header">
            <span className="page-badge">Help Center</span>
            <h1>How to Use ShopKeeperAI</h1>
            <p>Complete guide to managing your shop with AI</p>
          </div>

          <div className="help-tabs">
            <button 
              className={`tab-btn ${activeTab === 'getting-started' ? 'active' : ''}`}
              onClick={() => setActiveTab('getting-started')}
            >
              🚀 Getting Started
            </button>
            <button 
              className={`tab-btn ${activeTab === 'commands' ? 'active' : ''}`}
              onClick={() => setActiveTab('commands')}
            >
              💬 Commands
            </button>
            <button 
              className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              📋 Workflow
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => setActiveTab('tips')}
            >
              💡 Tips
            </button>
          </div>

          <div className="help-tab-content">
            {activeTab === 'getting-started' && (
              <div className="tab-panel">
                <h2>Getting Started in 5 Minutes</h2>
                
                <div className="steps-timeline">
                  <div className="timeline-step">
                    <div className="step-marker">1</div>
                    <div className="step-content">
                      <h3>Create Your Account</h3>
                      <p>Click "Sign Up" and enter your name, email, shop name, and password. It's free!</p>
                      <Link to="/signup" className="btn btn-primary btn-sm">Sign Up Now →</Link>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">2</div>
                    <div className="step-content">
                      <h3>Add Your First Products</h3>
                      <p>In the chat, type something like: <code>"Bought 50 pens at 10 each"</code></p>
                      <p>This adds 50 pens to your inventory at ₹10 cost price.</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">3</div>
                    <div className="step-content">
                      <h3>Record Your Sales</h3>
                      <p>When you sell something, type: <code>"Sold 5 pens at 15"</code></p>
                      <p>The system automatically updates inventory and calculates profit.</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">4</div>
                    <div className="step-content">
                      <h3>Create Invoices</h3>
                      <p>For customer bills, type: <code>"Invoice for Ahmed: 10 pens at 15"</code></p>
                      <p>Get a printable invoice instantly!</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">5</div>
                    <div className="step-content">
                      <h3>Check Your Progress</h3>
                      <p>Type <code>"Today summary"</code> to see sales, profit, and top sellers.</p>
                      <p>Visit Reports page for detailed analytics.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commands' && (
              <div className="tab-panel">
                <h2>All Commands Reference</h2>
                <p className="tab-intro">Type these in the chat to perform actions. The AI understands natural variations!</p>
                
                <div className="commands-list">
                  {commands.map((cat, idx) => (
                    <div key={idx} className="command-category">
                      <h3>{cat.category}</h3>
                      <div className="command-examples">
                        {cat.examples.map((ex, i) => (
                          <div key={i} className="command-item">
                            <code>{ex.command}</code>
                            <span>{ex.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'workflow' && (
              <div className="tab-panel">
                <h2>Daily Workflow</h2>
                
                <div className="workflow-section">
                  <h3>🌅 Morning Routine</h3>
                  <ol className="workflow-list">
                    <li>Login to your dashboard</li>
                    <li>Check <code>"What should I reorder?"</code> for low stock alerts</li>
                    <li>Review yesterday's summary if needed</li>
                  </ol>
                </div>

                <div className="workflow-section">
                  <h3>☀️ During the Day</h3>
                  <ol className="workflow-list">
                    <li>Record each sale: <code>"Sold 5 rice at 80"</code></li>
                    <li>Create invoices for customers who need bills</li>
                    <li>Record any purchases/restocking</li>
                  </ol>
                </div>

                <div className="workflow-section">
                  <h3>🌙 End of Day</h3>
                  <ol className="workflow-list">
                    <li>Type <code>"Today summary"</code> to see your performance</li>
                    <li>Check the Reports page for detailed analytics</li>
                    <li>Review top-selling items and profit margins</li>
                  </ol>
                </div>

                <div className="workflow-section">
                  <h3>📦 Weekly Tasks</h3>
                  <ol className="workflow-list">
                    <li>Review inventory levels</li>
                    <li>Place orders for low-stock items</li>
                    <li>Check which products are selling well</li>
                    <li>Adjust prices if needed using price recommendations</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="tab-panel">
                <h2>Pro Tips</h2>
                
                <div className="tips-grid">
                  <div className="tip-card">
                    <span className="tip-icon">💡</span>
                    <h3>Use Quick Buttons</h3>
                    <p>Click the quick action buttons above the chat input for common tasks.</p>
                  </div>

                  <div className="tip-card">
                    <span className="tip-icon">📦</span>
                    <h3>Keep Inventory Updated</h3>
                    <p>Record purchases immediately when you restock to keep accurate counts.</p>
                  </div>

                  <div className="tip-card">
                    <span className="tip-icon">🧾</span>
                    <h3>Batch Invoices</h3>
                    <p>Include multiple items in one invoice: "Invoice for X: 5 rice at 80, 2 oil at 150"</p>
                  </div>

                  <div className="tip-card">
                    <span className="tip-icon">📊</span>
                    <h3>Check Reports Daily</h3>
                    <p>The Reports page shows trends that help you make better decisions.</p>
                  </div>

                  <div className="tip-card">
                    <span className="tip-icon">🌐</span>
                    <h3>Translate Bills</h3>
                    <p>Use the translation widget to convert English supplier bills to Urdu.</p>
                  </div>

                  <div className="tip-card">
                    <span className="tip-icon">🔄</span>
                    <h3>Stay Consistent</h3>
                    <p>Use the same product names for accurate tracking (e.g., always "rice" not "chawal").</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="help-cta">
            <h2>Ready to Start?</h2>
            <p>Create your free account and transform your shop management today!</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Support</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <p>© 2024 ShopKeeperAI. Made with ❤️ for small businesses.</p>
      </footer>
    </div>
  );
}

export default Help;


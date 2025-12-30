import React, { useState, useRef } from 'react';
import './ChatInput.css';

function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSend(message.trim());
    setMessage('');
    inputRef.current?.focus();
  };

  const quickCommands = [
    { label: '📦 Inventory', command: 'Show inventory' },
    { label: '📊 Summary', command: 'Today sales summary' },
    { label: '⚠️ Low Stock', command: 'What should I reorder?' },
  ];

  const handleQuickCommand = (command) => {
    onSend(command);
  };

  return (
    <div className="chat-input-container">
      <div className="quick-commands">
        {quickCommands.map((item, idx) => (
          <button
            key={idx}
            className="quick-command-btn"
            onClick={() => handleQuickCommand(item.command)}
            disabled={disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a command... e.g., 'Sold 5 items at 100 each'"
            className="chat-input-field"
            disabled={disabled}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim() || disabled}
          >
            {disabled ? (
              <span className="spinner"></span>
            ) : (
              <span className="send-icon">➤</span>
            )}
          </button>
        </div>
        <div className="input-hint">
          💡 Try: "Sold 2kg sugar at 130" • "Bought 10 pens at 20 each" • "Create invoice for Ahmed"
        </div>
      </form>
    </div>
  );
}

export default ChatInput;


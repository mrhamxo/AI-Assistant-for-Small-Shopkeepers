import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomeModal.css';

function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '👋',
      title: 'Welcome to ShopKeeperAI!',
      content: "Your intelligent shop management assistant. Let's get you started with a quick tour.",
    },
    {
      icon: '💬',
      title: 'Chat with AI',
      content: 'Simply type commands like "Sold 5 rice at 80" or "Show inventory". Our AI understands natural language!',
    },
    {
      icon: '📦',
      title: 'Track Inventory',
      content: 'Keep track of all your products. Get alerts when stock is running low.',
    },
    {
      icon: '📄',
      title: 'Create Invoices',
      content: 'Generate professional invoices instantly by saying "Invoice for Ahmed: 5 rice at 80"',
    },
    {
      icon: '📊',
      title: 'View Reports',
      content: 'Check your daily sales, profits, and top-selling items anytime.',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboardingComplete', 'true');
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="welcome-modal">
        <div className="modal-content">
          <div className="step-icon">{currentStep.icon}</div>
          <h2>{currentStep.title}</h2>
          <p>{currentStep.content}</p>

          <div className="step-indicators">
            {steps.map((_, idx) => (
              <span 
                key={idx} 
                className={`indicator ${idx === step ? 'active' : ''} ${idx < step ? 'completed' : ''}`}
              ></span>
            ))}
          </div>

          <div className="modal-actions">
            {!isLastStep && (
              <button className="btn btn-ghost" onClick={handleSkip}>
                Skip Tour
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {isLastStep ? "Let's Start! 🚀" : 'Next →'}
            </button>
          </div>
        </div>

        {isLastStep && (
          <div className="quick-links">
            <p>Quick Links:</p>
            <div className="links-grid">
              <Link to="/help" className="quick-link" onClick={onClose}>
                <span>📖</span> Help Guide
              </Link>
              <Link to="/inventory" className="quick-link" onClick={onClose}>
                <span>📦</span> Inventory
              </Link>
              <Link to="/reports" className="quick-link" onClick={onClose}>
                <span>📊</span> Reports
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeModal;


import React from 'react';
import './Header.css';

interface HeaderProps {
  currentView: 'form' | 'dashboard';
  setCurrentView: (view: 'form' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo">🗳️ MLA Grievance Portal</h1>
          <p className="subtitle">Your Voice, Our Commitment</p>
        </div>
        <nav className="nav">
          <button 
            className={`nav-btn ${currentView === 'form' ? 'active' : ''}`}
            onClick={() => setCurrentView('form')}
          >
            📝 Lodge Grievance
          </button>
          <button 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
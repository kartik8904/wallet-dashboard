import React, { useState, useEffect } from 'react';
import { WalletProvider } from './context/WalletContext';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <WalletProvider>
      <div className="App">
        <header className="app-header">
          <h1>Wallet Dashboard</h1>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;
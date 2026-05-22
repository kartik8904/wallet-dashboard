import React, { useState, useEffect } from 'react';
import { WalletProvider } from './context/WalletContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('wallet_user');
    const token = localStorage.getItem('wallet_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('wallet_token');
    localStorage.removeItem('wallet_user');
    setUser(null);
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>Wallet Dashboard</h1>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <WalletProvider>
      <div className="App">
        <header className="app-header">
          <h1>Wallet Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Hey, {user.name}
            </span>
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;

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
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setChecking(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('wallet_token');
    localStorage.removeItem('wallet_user');
    setUser(null);
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>Wallet Dashboard</h1>
        <div className="header-right">
          {user && (
            <span className="user-greeting">Hey, {user.name}</span>
          )}
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          {user && (
            <button className="btn btn-danger" onClick={handleLogout}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          )}
        </div>
      </header>

      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { authAPI } from '../api';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    if (isRegister && !form.name) {
      setError('Name is required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = isRegister
        ? await authAPI.register(form)
        : await authAPI.login(form);

      const { token, user } = res.data.data;
      localStorage.setItem('wallet_token', token);
      localStorage.setItem('wallet_user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}></div>
          <h1 style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 700 }}>
            Wallet Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {isRegister ? 'Create your account' : 'Sign in to your wallet'}
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="error-banner" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <span
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

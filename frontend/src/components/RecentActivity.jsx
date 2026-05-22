import React from 'react';
import { useWallet } from '../context/WalletContext';

const RecentActivity = () => {
  const { transactions, loading } = useWallet();

  const recentFive = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="card">
        <p className="section-title">Recent Activity</p>
        <div className="empty-state"><p>Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="section-title">Recent Activity</p>
      {recentFive.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '1.5rem' }}>📭</p>
          <p>No recent activity</p>
        </div>
      ) : (
        <div>
          {recentFive.map(t => (
            <div key={t.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: t.type === 'credit' ? '#dcfce7' : '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  {t.type === 'credit' ? '↑' : '↓'}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {t.description}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {formatDate(t.createdAt)} · <span className={`badge badge-${t.status}`}>{t.status}</span>
                  </div>
                </div>
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: t.type === 'credit' ? 'var(--credit-color)' : 'var(--debit-color)'
              }}>
                {t.type === 'credit' ? '+' : '-'}₹{formatAmount(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;

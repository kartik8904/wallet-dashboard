import React from 'react';
import { useWallet } from '../context/WalletContext';

const RecentActivity = () => {
  const { transactions, loading } = useWallet();

  const recentFive = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount || 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });

  if (loading && transactions.length === 0) {
    return (
      <div className="card">
        <p className="section-title">Recent Activity</p>
        <div className="empty-state"><p>Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="section-title" style={{ margin: 0 }}>Recent Activity</p>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Last {recentFive.length} transactions
        </span>
      </div>

      {recentFive.length === 0 ? (
        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '2rem' }}>📭</p>
          <p>No recent activity</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {recentFive.map((t, index) => (
            <div key={t.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.9rem 0',
              borderBottom: index < recentFive.length - 1 ? '1px solid var(--border)' : 'none',
              flex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: t.type === 'credit' ? '#dcfce7' : '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: t.type === 'credit' ? '#166534' : '#991b1b',
                  flexShrink: 0
                }}>
                  {t.type === 'credit' ? '↑' : '↓'}
                </div>
                <div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {t.description}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {formatDate(t.createdAt)}
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                  </div>
                </div>
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: t.type === 'credit' ? 'var(--credit-color)' : 'var(--debit-color)',
                flexShrink: 0,
                marginLeft: '1rem'
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

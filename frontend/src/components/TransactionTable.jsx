import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const TransactionTable = ({ onEdit }) => {
  const { transactions, loading, pagination, setPage, deleteTransaction } = useWallet();
  const [deletingId, setDeletingId] = useState(null);

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!loading && transactions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <p style={{ fontSize: '2rem' }}>📭</p>
          <p>No transactions found</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Add your first transaction using the button above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>
                  <span className={`badge badge-${t.type}`}>
                    {t.type === 'credit' ? '↑' : '↓'} {t.type}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: t.type === 'credit' ? 'var(--credit-color)' : 'var(--debit-color)' }}>
                  {t.type === 'credit' ? '+' : '-'}₹{formatAmount(t.amount)}
                </td>
                <td>{t.currency}</td>
                <td>
                  <span className={`badge badge-${t.status}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.description}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {formatDate(t.createdAt)}
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(t)}>Edit</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                  >
                    {deletingId === t.id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPage(pagination.page - 1)}
          >
            ← Prev
          </button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              className={pagination.page === i + 1 ? 'active' : ''}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPage(pagination.page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;

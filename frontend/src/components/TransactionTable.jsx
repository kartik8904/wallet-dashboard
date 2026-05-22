import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const TransactionTable = ({ onEdit }) => {
  const { transactions, loading, pagination, setPage, deleteTransaction } = useWallet();
  const [deletingId, setDeletingId] = useState(null);

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount || 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeletingId(id);
    try { await deleteTransaction(id); }
    finally { setDeletingId(null); }
  };

  if (loading && transactions.length === 0) {
    return <div className="empty-state"><p>Loading transactions...</p></div>;
  }

  if (!loading && transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p>No transactions found</p>
        <p className="empty-sub">Add your first transaction using the button above</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
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
                <td><span className={`badge badge-${t.type}`}>{t.type === 'credit' ? '↑' : '↓'} {t.type}</span></td>
                <td>
                  <span className={t.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                    {t.type === 'credit' ? '+' : '-'}₹{formatAmount(t.amount)}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{t.currency}</td>
                <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                  {t.description}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(t.createdAt)}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(t)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(t.id)} disabled={deletingId === t.id}>
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
          <button disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)}>←</button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(pagination.page + 1)}>→</button>
        </div>
      )}
    </>
  );
};

export default TransactionTable;

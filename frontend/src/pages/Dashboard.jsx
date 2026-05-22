import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import AddTransactionForm from '../components/AddTransactionForm';
import Filters from '../components/Filters';
import RecentActivity from '../components/RecentActivity';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const { error, clearError } = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="dashboard">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="btn">✕</button>
        </div>
      )}

      <SummaryCards />

      <div className="two-col">
        <RecentActivity />
        <Analytics />
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p className="section-title" style={{ margin: 0 }}>All Transactions</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>
        </div>
        <Filters />
        <TransactionTable onEdit={handleEdit} />
      </div>

      {showForm && (
        <AddTransactionForm
          onClose={handleClose}
          editData={editingTransaction}
        />
      )}
    </div>
  );
};

export default Dashboard;

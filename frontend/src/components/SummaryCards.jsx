import React from 'react';
import { useWallet } from '../context/WalletContext';

const SummaryCards = () => {
  const { wallet, loading } = useWallet();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading && !wallet) {
    return (
      <div className="summary-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="summary-card">
            <div className="label">Loading...</div>
            <div className="value">--</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="label">Total Balance</div>
        <div className="value primary">₹{formatAmount(wallet?.balance)}</div>
        <div className="sub">Current wallet balance</div>
      </div>

      <div className="summary-card">
        <div className="label">Total Credits</div>
        <div className="value credit">₹{formatAmount(wallet?.totalCredits)}</div>
        <div className="sub">Money received</div>
      </div>

      <div className="summary-card">
        <div className="label">Total Debits</div>
        <div className="value debit">₹{formatAmount(wallet?.totalDebits)}</div>
        <div className="sub">Money spent</div>
      </div>

      <div className="summary-card">
        <div className="label">Total Transactions</div>
        <div className="value primary">{wallet?.totalTransactions || 0}</div>
        <div className="sub">All time transactions</div>
      </div>
    </div>
  );
};

export default SummaryCards;
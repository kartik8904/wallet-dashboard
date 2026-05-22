import React from 'react';
import { useWallet } from '../context/WalletContext';
import SummaryCards from '../components/SummaryCards';

const Dashboard = () => {
  const { error, clearError } = useWallet();

  return (
    <div className="dashboard">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="btn">✕</button>
        </div>
      )}
      <SummaryCards />
    </div>
  );
};

export default Dashboard;
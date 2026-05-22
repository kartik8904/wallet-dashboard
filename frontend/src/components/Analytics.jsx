import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useWallet } from '../context/WalletContext';

const Analytics = () => {
  const { transactions } = useWallet();

  const completedTransactions = transactions.filter(t => t.status === 'completed');

  const totalCredits = completedTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = completedTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const barData = [
    { name: 'Credits', amount: totalCredits, fill: '#22c55e' },
    { name: 'Debits', amount: totalDebits, fill: '#ef4444' }
  ];

  const countData = [
    { name: 'Credit', value: transactions.filter(t => t.type === 'credit').length },
    { name: 'Debit', value: transactions.filter(t => t.type === 'debit').length },
    { name: 'Pending', value: transactions.filter(t => t.status === 'pending').length },
    { name: 'Failed', value: transactions.filter(t => t.status === 'failed').length }
  ].filter(d => d.value > 0);

  const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6366f1'];

  const formatAmount = (value) => {
    return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="card">
        <p className="section-title">Analytics</p>
        <div className="empty-state">
          <p style={{ fontSize: '1.5rem' }}>📊</p>
          <p>Add transactions to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="section-title">Analytics</p>
      <div className="two-col" style={{ marginBottom: 0 }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Credits vs Debits (₹)
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tickFormatter={formatAmount} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip formatter={(value) => formatAmount(value)} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Transaction Count by Type
          </p>
          {countData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={countData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {countData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No data yet</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

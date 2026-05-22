import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { transactionsAPI } from '../api';
import { useWallet } from '../context/WalletContext';

const Analytics = () => {
  const { wallet } = useWallet();
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await transactionsAPI.getAll({ page: 1, limit: 1000 });
        setAllTransactions(res.data.data || []);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [wallet]);

  const completedTransactions = allTransactions.filter(t => t.status === 'completed');

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

  const creditCount = allTransactions.filter(t => t.type === 'credit').length;
  const debitCount = allTransactions.filter(t => t.type === 'debit').length;
  const pendingCount = allTransactions.filter(t => t.status === 'pending').length;
  const failedCount = allTransactions.filter(t => t.status === 'failed').length;

  const pieData = [
    creditCount > 0 && { name: 'Credit', value: creditCount, color: '#22c55e' },
    debitCount > 0 && { name: 'Debit', value: debitCount, color: '#ef4444' },
    pendingCount > 0 && { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    failedCount > 0 && { name: 'Failed', value: failedCount, color: '#6366f1' }
  ].filter(Boolean);

  const formatAmount = (value) =>
    `₹${new Intl.NumberFormat('en-IN').format(value)}`;

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{label}</p>
          <p style={{ color: label === 'Credits' ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
            {formatAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <p className="section-title">Analytics</p>
        <div className="empty-state"><p>Loading analytics...</p></div>
      </div>
    );
  }

  if (allTransactions.length === 0) {
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

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
          Credits vs Debits — Completed Transactions (₹)
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={barData}
            barSize={80}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${new Intl.NumberFormat('en-IN').format(v)}`}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
          All {allTransactions.length} Transactions by Type & Status
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} transactions`, name]}
              />
              <Legend
                formatter={(value, entry) => (
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}>
            {creditCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Credit Transactions</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ef4444' }}>
            {debitCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Debit Transactions</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6366f1' }}>
            {failedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Failed</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

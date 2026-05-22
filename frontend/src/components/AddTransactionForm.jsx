import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const initialForm = {
  type: 'credit',
  amount: '',
  currency: 'INR',
  description: '',
  status: 'completed'
};

const AddTransactionForm = ({ onClose, editData }) => {
  const { addTransaction, editTransaction, wallet } = useWallet();
  const [form, setForm] = useState(editData || initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.type) newErrors.type = 'Type is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) < 1)
      newErrors.amount = 'Amount must be at least ₹1';
    if (!form.description || form.description.trim().length < 3)
      newErrors.description = 'Description must be at least 3 characters';
    if (!form.status) newErrors.status = 'Status is required';

    if (
      form.type === 'debit' &&
      form.status === 'completed' &&
      parseFloat(form.amount) > (wallet?.balance || 0)
    ) {
      newErrors.amount = `Insufficient balance. Available: ₹${new Intl.NumberFormat('en-IN').format(wallet?.balance)}`;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (editData) {
        await editTransaction(editData.id, {
          ...form,
          amount: parseFloat(form.amount)
        });
      } else {
        await addTransaction({
          ...form,
          amount: parseFloat(form.amount)
        });
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editData ? 'Edit Transaction' : 'Add New Transaction'}</h2>

        {apiError && (
          <div className="error-banner" style={{ marginBottom: '1rem' }}>
            <span>{apiError}</span>
          </div>
        )}

        <div className="form-group">
          <label>Transaction Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="credit">Credit — Money In ↑</option>
            <option value="debit">Debit — Money Out ↓</option>
          </select>
          {errors.type && <div className="form-error">{errors.type}</div>}
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount in ₹"
            min="1"
          />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
          {form.type === 'debit' && wallet && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
              Available balance: ₹{new Intl.NumberFormat('en-IN').format(wallet.balance)}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Salary, Grocery, Rent"
            maxLength={100}
          />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          {errors.status && <div className="form-error">{errors.status}</div>}
        </div>

        <div style={{ 
          background: 'var(--bg)', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px', 
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '1rem'
        }}>
          💡 All transactions are in <strong>Indian Rupee (₹ INR)</strong>
        </div>

        <div className="form-actions">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : editData ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionForm;

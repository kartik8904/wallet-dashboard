import React from 'react';
import { useWallet } from '../context/WalletContext';

const Filters = () => {
  const { filters, setFilters } = useWallet();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      currency: ''
    });
  };

  const hasActiveFilters = filters.search || filters.type || filters.status || filters.currency;

  return (
    <div className="filters-row">
      <input
        className="search-input"
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by description..."
      />

      <select
        className="filter-select"
        name="type"
        value={filters.type}
        onChange={handleChange}
      >
        <option value="">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>

      <select
        className="filter-select"
        name="status"
        value={filters.status}
        onChange={handleChange}
      >
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      <select
        className="filter-select"
        name="currency"
        value={filters.currency}
        onChange={handleChange}
      >
        <option value="">All Currencies</option>
        <option value="INR">INR ₹</option>
        <option value="USD">USD $</option>
        <option value="EUR">EUR €</option>
        <option value="GBP">GBP £</option>
      </select>

      {hasActiveFilters && (
        <button className="btn btn-danger" onClick={handleReset}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;

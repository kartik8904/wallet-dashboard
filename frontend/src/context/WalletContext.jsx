import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { walletAPI, transactionsAPI } from '../api';

const WalletContext = createContext();

const initialState = {
  wallet: null,
  transactions: [],
  pagination: {},
  loading: false,
  error: null,
  filters: {
    search: '',
    type: '',
    status: '',
    currency: '',
    page: 1,
    limit: 10
  }
};

const walletReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WALLET':
      return { ...state, wallet: action.payload, loading: false };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload.data,
        pagination: action.payload.pagination,
        loading: false
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 }
      };
    case 'SET_PAGE':
      return {
        ...state,
        filters: { ...state.filters, page: action.payload }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const fetchWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await walletAPI.getWallet();
      dispatch({ type: 'SET_WALLET', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch wallet' });
    }
  };

  const fetchTransactions = async (filters = state.filters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.currency) params.currency = filters.currency;
      params.page = filters.page;
      params.limit = filters.limit;
      const res = await transactionsAPI.getAll(params);
      dispatch({ type: 'SET_TRANSACTIONS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch transactions' });
    }
  };

  const addTransaction = async (data) => {
    const res = await transactionsAPI.add(data);
    await fetchWallet();
    await fetchTransactions();
    return res.data;
  };

  const editTransaction = async (id, data) => {
    const res = await transactionsAPI.edit(id, data);
    await fetchWallet();
    await fetchTransactions();
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await transactionsAPI.remove(id);
    await fetchWallet();
    await fetchTransactions();
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPage = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchTransactions(state.filters);
  }, [state.filters]);

  return (
    <WalletContext.Provider value={{
      ...state,
      fetchWallet,
      fetchTransactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      setFilters,
      setPage,
      clearError
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used inside WalletProvider');
  return context;
};
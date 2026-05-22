import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const walletAPI = {
  getWallet: () => api.get('/wallet')
};

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  add: (data) => api.post('/transactions', data),
  edit: (id, data) => api.patch(`/transactions/${id}`, data),
  remove: (id) => api.delete(`/transactions/${id}`)
};

export default api;
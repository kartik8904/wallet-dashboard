import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wallet_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wallet_token');
      localStorage.removeItem('wallet_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const walletAPI = {
  getWallet: () => api.get('/wallet')
};

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  add: (data) => api.post('/transactions', data),
  edit: (id, data) => api.patch(`/transactions/${id}`, data),
  remove: (id) => api.delete(`/transactions/${id}`)
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export default api;

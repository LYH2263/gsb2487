import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:12487/api',
  timeout: 60000,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || '网络请求错误';
    return Promise.reject(new Error(message));
  }
);

export default api;

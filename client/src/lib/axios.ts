import axios from 'axios';

export const _axios = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5143/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
_axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
_axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Chỉ xóa token nếu không phải logout request
        const isLogoutRequest = error.config?.url?.includes('/logout');
        if (!isLogoutRequest) {
          localStorage.removeItem('token');
          localStorage.removeItem('authUser');
          // Reload trang để reset state
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);
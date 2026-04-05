import axios from 'axios';

export const _axios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:5143/api'
        : 'https://cinema-api-vetv.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
_axios.interceptors.request.use((config) => {
  if (config.data instanceof FormData && config.headers) {
    if (typeof (config.headers as any).set === 'function') {
      (config.headers as any).set('Content-Type', undefined);
    }
    delete (config.headers as Record<string, string>)['Content-Type'];
  }

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
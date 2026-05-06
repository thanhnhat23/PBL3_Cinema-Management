import axios, { AxiosHeaders } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

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
    // Correctly handle FormData headers without 'any'
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Content-Type', undefined);
    } else {
      delete (config.headers as Record<string, string>)['Content-Type'];
    }
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
        const isLogoutRequest = error.config?.url?.includes('/logout');
        if (!isLogoutRequest) {
          useAuthStore.getState().clearAuth();
        }
      }
    }
    return Promise.reject(error);
  }
);
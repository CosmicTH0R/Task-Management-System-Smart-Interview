import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: on 401, clear local state and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Import lazily to avoid circular dependency
      import('@/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

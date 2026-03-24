import axios from 'axios';
import { toast } from 'sonner';

let hasShownSessionExpiredToast = false;

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
    if (!error.response) {
      toast.error('Network error, please check your connection');
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (!hasShownSessionExpiredToast) {
        hasShownSessionExpiredToast = true;
        toast.error('Session expired, please login again');
      }

      // Import lazily to avoid circular dependency
      import('@/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });

      setTimeout(() => {
        hasShownSessionExpiredToast = false;
      }, 1500);

      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

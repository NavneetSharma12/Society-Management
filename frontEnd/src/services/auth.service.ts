import axios from 'axios';
import { User } from '@/types/user';
import { store } from '@/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };
};

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await axios.post(
      `${API_URL}/api/v1/user/login`,
      { email, password },
      getAuthHeader()
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.get(`${API_URL}/api/v1/user/logout`, getAuthHeader());
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/user/refresh-token`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Axios interceptor to handle token refresh
  setupAxiosInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Just retry the original request - the backend middleware will handle the refresh
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout the user
            store.dispatch({ type: 'auth/logout' });
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
};
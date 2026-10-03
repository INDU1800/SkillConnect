import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('skillconnect_token');
        localStorage.removeItem('skillconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;

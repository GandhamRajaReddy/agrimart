import axios from 'axios';

import env from '../../config/env';

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrimart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle API errors gracefully
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access. Redirecting to auth...');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

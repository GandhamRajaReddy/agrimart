import axios from 'axios';

import env from '../../config/env';
import tokenService from '../auth/tokenService';

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Queue state for 401 refresh coordination
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Endpoints that should not trigger automatic 401 token refresh
const AUTH_BYPASS_URLS = [
  '/auth/login/',
  '/auth/register/',
  '/auth/request-otp/',
  '/auth/verify-otp/',
  '/auth/token/refresh/',
  '/auth/refresh/',
];

const shouldBypassRefresh = (url) => {
  if (!url) return false;
  return AUTH_BYPASS_URLS.some((endpoint) => url.includes(endpoint));
};

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Transparent Refresh-Token Recovery
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Reject immediately if no response or not a 401
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Do not attempt refresh on auth endpoints (e.g. login, verify-otp, or refresh itself)
    if (shouldBypassRefresh(originalRequest.url) || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      tokenService.clearAuth();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('agrimart:auth:session-expired'));
      }
      return Promise.reject(error);
    }

    // If another refresh call is already in progress, enqueue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call token refresh using a clean Axios instance to avoid interceptor recursion
      const refreshResponse = await axios.post(
        `${env.apiBaseUrl}/auth/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 10000,
        }
      );

      const data = refreshResponse.data;
      const newAccessToken = data.access || data.token;
      const newRefreshToken = data.refresh || data.refresh_token;

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint');
      }

      tokenService.setAccessToken(newAccessToken);
      if (newRefreshToken) {
        tokenService.setRefreshToken(newRefreshToken);
      }

      // Replay all queued requests
      processQueue(null, newAccessToken);

      // Replay original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenService.clearAuth();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('agrimart:auth:session-expired'));
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;

const ACCESS_TOKEN_KEY = 'agrimart_token';
const REFRESH_TOKEN_KEY = 'agrimart_refresh_token';
const USER_KEY = 'agrimart_user';

/**
 * Safely parse a JWT payload without external dependencies.
 * Handles standard base64 and base64url encodings.
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
};

/**
 * Checks if a JWT token has expired.
 * @param {string} token
 * @param {number} bufferSeconds - Buffer before real expiry to consider token expired (default 30s)
 */
export const isTokenExpired = (token, bufferSeconds = 30) => {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return nowInSeconds >= payload.exp - bufferSeconds;
};

export const tokenService = {
  getAccessToken: () => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setAccessToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to set access token:', error);
    }
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setRefreshToken: (refreshToken) => {
    try {
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to set refresh token:', error);
    }
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Failed to parse user from storage:', error);
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (error) {
      console.error('Failed to set user in storage:', error);
    }
  },

  setAuth: ({ token, refreshToken, user }) => {
    if (token) tokenService.setAccessToken(token);
    if (refreshToken) tokenService.setRefreshToken(refreshToken);
    if (user) tokenService.setUser(user);
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear auth storage:', error);
    }
  },

  hasValidAccessToken: () => {
    const token = tokenService.getAccessToken();
    return Boolean(token && !isTokenExpired(token));
  },

  hasRefreshToken: () => {
    const refreshToken = tokenService.getRefreshToken();
    return Boolean(refreshToken && !isTokenExpired(refreshToken, 0));
  },

  isAuthenticated: () => {
    // User is considered authenticated if access token is valid, or if refresh token is present to obtain one
    return Boolean(tokenService.getUser() && (tokenService.hasValidAccessToken() || tokenService.hasRefreshToken()));
  },
};

export default tokenService;


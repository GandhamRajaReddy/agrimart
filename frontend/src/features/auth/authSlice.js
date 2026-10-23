import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('agrimart_user');
    if (savedUser) return JSON.parse(savedUser);
  } catch (error) {
    console.error('Failed to parse saved user state:', error);
  }
  return null;
};

const initialUser = getInitialUser();
const initialToken = localStorage.getItem('agrimart_token') || null;
const initialRefreshToken = localStorage.getItem('agrimart_refresh_token') || null;

const initialState = {
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!(initialUser && initialToken),
  pendingOTP: null,
  isLoading: false,
  error: null,
  language: 'English',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      state.isAuthenticated = !!(user && token);
      state.pendingOTP = null;
      state.error = null;

      if (token) localStorage.setItem('agrimart_token', token);
      if (refreshToken) {
        localStorage.setItem('agrimart_refresh_token', refreshToken);
      }
      if (user) localStorage.setItem('agrimart_user', JSON.stringify(user));
    },

    setPendingOTP: (state, action) => {
      state.pendingOTP = action.payload;
    },

    clearPendingOTP: (state) => {
      state.pendingOTP = null;
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user) localStorage.setItem('agrimart_user', JSON.stringify(state.user));
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.pendingOTP = null;
      state.error = null;
      localStorage.removeItem('agrimart_token');
      localStorage.removeItem('agrimart_refresh_token');
      localStorage.removeItem('agrimart_user');
    },
  },
});

export const {
  setCredentials,
  setPendingOTP,
  clearPendingOTP,
  updateUser,
  setLanguage,
  setLoading,
  setError,
  logout,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectUser = (state) => state.auth.user;
export const setUser = setCredentials;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectPendingOTP = (state) => state.auth.pendingOTP;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectLanguage = (state) => state.auth.language;

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import tokenService from '../../services/auth/tokenService';

const initialUser = tokenService.getUser();
const initialToken = tokenService.getAccessToken();
const initialRefreshToken = tokenService.getRefreshToken();
const initialIsAuthenticated = tokenService.isAuthenticated();

const initialState = {
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: initialIsAuthenticated,
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
      state.isAuthenticated = Boolean(user && (token || refreshToken));
      state.pendingOTP = null;
      state.error = null;

      tokenService.setAuth({ token, refreshToken, user });
    },

    setPendingOTP: (state, action) => {
      state.pendingOTP = action.payload;
    },

    clearPendingOTP: (state) => {
      state.pendingOTP = null;
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      tokenService.setUser(state.user);
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
      tokenService.clearAuth();
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

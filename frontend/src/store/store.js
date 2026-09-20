import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});


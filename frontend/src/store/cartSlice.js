import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCartDrawer: (state, action) => {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    },
    openCartDrawer: (state) => {
      state.isCartOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartOpen = false;
    },
  },
});

export const { toggleCartDrawer, openCartDrawer, closeCartDrawer } = cartSlice.actions;

export const selectIsCartOpen = (state) => state.cart.isCartOpen;

export default cartSlice.reducer;

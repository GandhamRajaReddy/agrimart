import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'prod-1',
      name: 'Bio-Shield Tri-Fungicide Gold',
      category: 'Pesticides & Fungicides',
      price: 649,
      unit: '500 ml',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
      quantity: 1,
      targetCrop: 'Wheat & Paddy',
      dosageNote: '2.5 ml per liter of water',
    },
    {
      id: 'prod-4',
      name: 'Kisan Shakti Hybrid Cotton Seed (BT-II)',
      category: 'Seeds',
      price: 890,
      unit: '475 gm packet',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
      quantity: 2,
      targetCrop: 'Cotton',
      dosageNote: '2 packets per acre',
    }
  ],
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      state.isCartOpen = true;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCartDrawer: (state, action) => {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartDrawer } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;

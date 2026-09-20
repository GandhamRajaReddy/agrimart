import axiosClient from '../../../services/http/axiosClient';

export const cartApi = {
  // Fetch active cart
  getCart: async () => {
    const response = await axiosClient.get('/cart/');
    return response.data;
  },

  // Add item to cart
  addToCart: async ({ productId, quantity = 1 }) => {
    const response = await axiosClient.post('/cart/items/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  // Update item quantity
  updateQuantity: async ({ itemId, quantity }) => {
    const response = await axiosClient.patch(`/cart/items/${itemId}/`, {
      quantity,
    });
    return response.data;
  },

  // Remove single item
  removeFromCart: async (itemId) => {
    const response = await axiosClient.delete(`/cart/items/${itemId}/`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axiosClient.delete('/cart/clear/');
    return response.data;
  },
};

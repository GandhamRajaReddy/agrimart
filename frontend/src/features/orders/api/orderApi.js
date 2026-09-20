import axiosClient from '../../../services/http/axiosClient';

export const orderApi = {
  // Fetch user orders
  getOrders: async () => {
    const response = await axiosClient.get('/orders/');
    return response.data;
  },

  // Fetch order details
  getOrderDetails: async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}/`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await axiosClient.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },
};

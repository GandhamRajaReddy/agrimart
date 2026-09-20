import axiosClient from '../../../services/http/axiosClient';

export const checkoutApi = {
  // Fetch checkout summary
  getCheckoutSummary: async () => {
    const response = await axiosClient.get('/checkout/');
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await axiosClient.get('/addresses/');
    return response.data;
  },

  // Create new delivery address
  createAddress: async (addressData) => {
    const response = await axiosClient.post('/addresses/', addressData);
    return response.data;
  },

  // Place order
  placeOrder: async (orderPayload) => {
    const response = await axiosClient.post('/orders/', orderPayload);
    return response.data;
  },
};

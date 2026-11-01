import axiosClient from '../../../services/http/axiosClient';

export const getMarketStatus = async () => {
  const response = await axiosClient.get('/market/status/');
  return response.data;
};

export default { getMarketStatus };


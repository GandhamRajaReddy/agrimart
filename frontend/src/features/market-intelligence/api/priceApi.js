import { getMarketStatus } from './mandiApi';

export const getPrices = async () => {
  return getMarketStatus();
};

export default { getPrices };

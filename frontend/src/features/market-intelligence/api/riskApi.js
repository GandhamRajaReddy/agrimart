import { getMarketStatus } from './mandiApi';

export const getMarketRisk = async () => {
  return getMarketStatus();
};

export default { getMarketRisk };

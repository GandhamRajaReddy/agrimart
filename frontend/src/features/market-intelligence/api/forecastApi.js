import { getMarketStatus } from './mandiApi';

export const getPriceForecast = async () => {
  // Fail-closed until AGMARKNET historical model validation passes
  return getMarketStatus();
};

export default { getPriceForecast };


/**
 * Yield prediction API.
 * Remains fail-closed until Karnataka historical crop yield datasets and validation pass.
 */
export const getYieldPrediction = async () => {
  throw new Error('Yield prediction models are pending backtesting and validation.');
};

export default { getYieldPrediction };


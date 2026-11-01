import axiosClient from '../../../services/http/axiosClient';

/**
 * Request Karnataka crop planning and profitability analysis.
 * Operates in fail-closed mode until verified mandi data and models pass validation.
 */
export const getCropPlan = async (payload) => {
  const response = await axiosClient.post('/market/crop-plan/', payload);
  return response.data;
};

export default { getCropPlan };

import tokenService from '../auth/tokenService';

/**
 * Utility to extract bearer token header
 */
export const getAuthHeader = () => {
  const token = tokenService.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default { getAuthHeader };


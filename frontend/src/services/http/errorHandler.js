export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred.') => {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  const data = error.response?.data;
  if (!data) {
    if (error.message === 'Network Error') {
      return 'Unable to reach the server. Please check your internet connection.';
    }
    return error.message || fallbackMessage;
  }

  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.message) return data.message;

  // Handle DRF validation error dicts
  const firstKey = Object.keys(data)[0];
  if (firstKey && Array.isArray(data[firstKey])) {
    return `${firstKey}: ${data[firstKey].join(' ')}`;
  }

  return fallbackMessage;
};

export default { getErrorMessage };

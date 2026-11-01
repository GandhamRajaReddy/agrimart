import { useState } from 'react';

export const useDetectionHistory = () => {
  const [history] = useState([]);
  const [isLoading] = useState(false);

  return { history, isLoading };
};

export default useDetectionHistory;

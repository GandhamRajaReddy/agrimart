import { useState } from 'react';
import { detectPlantDisease } from '../api/detectionApi';

export const useDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const detect = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await detectPlantDisease(file);
      setResult(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  };

  return { detect, reset, isLoading, error, result };
};

export default useDetection;


import { useQuery } from '@tanstack/react-query';
import { getPriceForecast } from '../api/forecastApi';

export const usePriceForecast = () => {
  return useQuery({
    queryKey: ['price-forecast-status'],
    queryFn: getPriceForecast,
    staleTime: 60000,
  });
};

export default usePriceForecast;


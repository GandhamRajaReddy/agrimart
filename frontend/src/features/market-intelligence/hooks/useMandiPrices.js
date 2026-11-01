import { useQuery } from '@tanstack/react-query';
import { getMarketStatus } from '../api/mandiApi';

export const useMandiPrices = () => {
  return useQuery({
    queryKey: ['market-status'],
    queryFn: getMarketStatus,
    staleTime: 60000,
  });
};

export default useMandiPrices;


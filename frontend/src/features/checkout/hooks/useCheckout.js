import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutApi } from '../api/checkoutApi';
import { cartQueryKeys } from '../../cart/hooks/useCart';

export const checkoutQueryKeys = {
  addresses: ['addresses'],
  summary: ['checkout', 'summary'],
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Addresses
  const addressesQuery = useQuery({
    queryKey: checkoutQueryKeys.addresses,
    queryFn: checkoutApi.getAddresses,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Summary
  const summaryQuery = useQuery({
    queryKey: checkoutQueryKeys.summary,
    queryFn: checkoutApi.getCheckoutSummary,
    staleTime: 1000 * 60,
  });

  // 3. Create Address Mutation
  const createAddressMutation = useMutation({
    mutationFn: checkoutApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutQueryKeys.addresses });
    },
  });

  // 4. Place Order Mutation
  const placeOrderMutation = useMutation({
    mutationFn: checkoutApi.placeOrder,
    onSuccess: () => {
      // Invalidate cart & order queries on order placement
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    addresses: addressesQuery.data || [],
    isLoadingAddresses: addressesQuery.isLoading,

    summary: summaryQuery.data || { subtotal: 0, delivery_fee: 0, total: 0, item_count: 0 },
    isLoadingSummary: summaryQuery.isLoading,

    createAddress: createAddressMutation.mutateAsync,
    isCreatingAddress: createAddressMutation.isPending,

    placeOrder: placeOrderMutation.mutateAsync,
    isPlacingOrder: placeOrderMutation.isPending,
  };
};

export default useCheckout;

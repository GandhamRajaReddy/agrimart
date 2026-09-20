import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';

export const orderQueryKeys = {
  all: ['orders'],
  detail: (id) => ['orders', id],
};

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: orderQueryKeys.all,
    queryFn: orderApi.getOrders,
    staleTime: 1000 * 60 * 2,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
    },
  });

  return {
    orders: ordersQuery.data?.results || [],
    count: ordersQuery.data?.count || 0,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,

    cancelOrder: cancelOrderMutation.mutateAsync,
    isCancelling: cancelOrderMutation.isPending,
    refetch: ordersQuery.refetch,
  };
};

export const useOrderDetail = (orderId) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApi.getOrderDetails(orderId),
    enabled: Boolean(orderId),
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
    },
  });

  return {
    order: detailQuery.data,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,

    cancelOrder: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { cartApi } from '../api/cartApi';
import { openCartDrawer } from '../../../store/cartSlice';

export const cartQueryKeys = {
  all: ['cart'],
  detail: () => [...cartQueryKeys.all, 'detail'],
};

export const useCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // 1. Fetch Cart Query
  const cartQuery = useQuery({
    queryKey: cartQueryKeys.detail(),
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. Add To Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity = 1 }) => cartApi.addToCart({ productId, quantity }),
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.detail(), data);
      dispatch(openCartDrawer());
    },
  });

  // 3. Update Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => cartApi.updateQuantity({ itemId, quantity }),
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.detail(), data);
    },
  });

  // 4. Remove Item Mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId) => cartApi.removeFromCart(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.detail(), data);
    },
  });

  // 5. Clear Cart Mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.detail(), data);
    },
  });

  const cart = cartQuery.data || { items: [], subtotal: 0, delivery_fee: 0, total: 0, item_count: 0 };

  return {
    cart,
    items: cart.items || [],
    subtotal: cart.subtotal || 0,
    deliveryFee: cart.delivery_fee || 0,
    total: cart.total || 0,
    itemCount: cart.item_count || 0,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,

    addToCart: (params) => {
      // Support passing both { productId, quantity } or string productId
      if (typeof params === 'string') {
        return addToCartMutation.mutateAsync({ productId: params, quantity: 1 });
      }
      return addToCartMutation.mutateAsync(params);
    },
    isAddingToCart: addToCartMutation.isPending,

    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateQuantityMutation.isPending,

    removeFromCart: removeFromCartMutation.mutateAsync,
    isRemovingFromCart: removeFromCartMutation.isPending,

    clearCart: clearCartMutation.mutateAsync,
    isClearingCart: clearCartMutation.isPending,

    refetch: cartQuery.refetch,
  };
};

export default useCart;

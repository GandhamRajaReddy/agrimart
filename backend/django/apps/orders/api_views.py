from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.cart.api_views import get_user_cart
from .models import Address, Order
from .serializers import (
    AddressSerializer,
    OrderSerializer,
    OrderCreateSerializer,
)
from .services import OrderService


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class CheckoutSummaryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_user_cart(request)
        return Response(
            {
                "cart_id": str(cart.id),
                "subtotal": cart.subtotal,
                "delivery_fee": cart.delivery_fee,
                "tax": 0.00,
                "discount": 0.00,
                "total": cart.total,
                "item_count": cart.item_count,
            }
        )


class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items")
        serializer = OrderSerializer(orders, many=True)
        return Response({"count": orders.count(), "results": serializer.data})

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        address_id = data.get("address_id")
        shipping_address = data.get("shipping_address")
        payment_method = data.get("payment_method", Order.PaymentMethod.COD)

        if address_id:
            try:
                addr = Address.objects.get(id=address_id, user=request.user)
                shipping_address = AddressSerializer(addr).data
            except Address.DoesNotExist:
                return Response(
                    {"detail": "Specified shipping address was not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        cart = get_user_cart(request)
        order = OrderService.create_order_from_cart(
            user=request.user,
            cart=cart,
            shipping_address_data=shipping_address,
            payment_method=payment_method,
        )

        output_serializer = OrderSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)



class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


class OrderCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if order.status in [Order.Status.SHIPPED, Order.Status.DELIVERED, Order.Status.CANCELLED]:
            return Response(
                {"detail": f"Order cannot be cancelled in status '{order.status}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = Order.Status.CANCELLED
        order.save()
        return Response(
            {
                "success": True,
                "message": "Order cancelled successfully.",
                "status": order.status,
            }
        )

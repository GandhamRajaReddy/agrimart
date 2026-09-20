from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
)
from apps.products.models import Product


def get_user_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    if not request.session.session_key:
        request.session.create()
    session_key = request.session.session_key

    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_user_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_user_cart(request)
        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        product = Product.objects.get(id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        serializer = UpdateCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_user_cart(request)
        cart_item = CartItem.objects.filter(cart=cart, id=pk).first()

        if not cart_item:
            return Response({"detail": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save()

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)

    def delete(self, request, pk):
        cart = get_user_cart(request)
        cart_item = CartItem.objects.filter(cart=cart, id=pk).first()

        if cart_item:
            cart_item.delete()

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)


class ClearCartView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request):
        cart = get_user_cart(request)
        cart.items.all().delete()
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)

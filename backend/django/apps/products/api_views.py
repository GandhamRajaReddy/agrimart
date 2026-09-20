from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_featured', 'in_stock', 'category__slug']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'rating', 'created_at']


class FeaturedProductListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.filter(is_featured=True)
    serializer_class = ProductSerializer
    pagination_class = None

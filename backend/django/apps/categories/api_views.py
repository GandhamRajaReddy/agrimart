from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer


class CategoryListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    pagination_class = None

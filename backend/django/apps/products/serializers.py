from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    category_slug = serializers.ReadOnlyField(source="category.slug")
    reviews = serializers.ReadOnlyField(source="reviews_count")
    image = serializers.ReadOnlyField(source="image_url")

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category_name',
            'category_slug',
            'description',
            'price',
            'original_price',
            'unit',
            'rating',
            'reviews',
            'reviews_count',
            'image',
            'image_url',
            'badge',
            'in_stock',
            'is_featured',
        ]

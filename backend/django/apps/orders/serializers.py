from rest_framework import serializers
from .models import Address, Order, OrderItem


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "full_name",
            "phone",
            "address_line1",
            "address_line2",
            "village",
            "district",
            "state",
            "pincode",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user if self.context.get("request") and self.context["request"].user.is_authenticated else None
        validated_data["user"] = user
        if validated_data.get("is_default") and user:
            Address.objects.filter(user=user, is_default=True).update(is_default=False)
        return super().create(validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "unit_price",
            "quantity",
            "line_total",
        ]
        read_only_fields = ["id", "product_name", "unit_price", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_count = serializers.IntegerField(source="items.count", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "payment_status",
            "payment_method",
            "subtotal",
            "delivery_fee",
            "tax",
            "discount",
            "total",
            "shipping_address",
            "items",
            "items_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "status",
            "payment_status",
            "subtotal",
            "delivery_fee",
            "tax",
            "discount",
            "total",
            "items",
            "items_count",
            "created_at",
            "updated_at",
        ]


class OrderCreateSerializer(serializers.Serializer):
    address_id = serializers.UUIDField(required=False, allow_null=True)
    shipping_address = serializers.DictField(required=False, allow_null=True)
    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.COD
    )

    def validate(self, attrs):
        address_id = attrs.get("address_id")
        shipping_address = attrs.get("shipping_address")
        if not address_id and not shipping_address:
            raise serializers.ValidationError(
                {"shipping_address": "Either address_id or shipping_address data must be provided."}
            )
        return attrs

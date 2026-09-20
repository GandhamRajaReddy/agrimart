import uuid
import random
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem


class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order_from_cart(user, cart, shipping_address_data, payment_method="COD"):
        """
        Atomically converts a active Cart into a permanent Order snapshot and clears the Cart.
        """
        items = cart.items.select_related("product").all()
        if not items.exists():
            raise ValidationError({"detail": "Cannot place order with an empty cart."})

        # Calculate totals server-side
        subtotal = sum(item.line_total for item in items)
        delivery_fee = 50.00 if 0 < subtotal < 1000 else 0.00
        tax = 0.00
        discount = 0.00
        total = float(subtotal) + delivery_fee - discount

        # Generate unique order number (e.g., AGR-2026-X8Y9Z2)
        year = timezone.now().strftime("%Y")
        random_suffix = uuid.uuid4().hex[:6].upper()
        order_number = f"AGR-{year}-{random_suffix}"

        # Create Order record
        order = Order.objects.create(
            order_number=order_number,
            user=user if user and user.is_authenticated else None,
            status=Order.Status.CONFIRMED,
            payment_status=Order.PaymentStatus.PENDING,
            payment_method=payment_method,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            tax=tax,
            discount=discount,
            total=total,
            shipping_address=shipping_address_data,
        )

        # Create OrderItem snapshots
        order_items = []
        for cart_item in items:
            product = cart_item.product
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=cart_item.quantity,
                    line_total=cart_item.line_total,
                )
            )
        OrderItem.objects.bulk_create(order_items)

        # Clear cart items after order creation
        cart.items.all().delete()

        return order

import uuid
from django.db import models
from django.conf import settings
from apps.products.models import Product


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="carts",
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    @property
    def subtotal(self):
        return sum(item.line_total for item in self.items.all())

    @property
    def delivery_fee(self):
        return 50.0 if self.subtotal > 0 and self.subtotal < 1000 else 0.0

    @property
    def total(self):
        return float(self.subtotal) + self.delivery_fee

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        return f"Cart {self.id} ({self.user or self.session_key})"


class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("cart", "product")
        ordering = ["created_at"]

    @property
    def line_total(self):
        return float(self.product.price) * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    class Role(models.TextChoices):
        FARMER = "FARMER", "Farmer"
        BUYER = "BUYER", "Buyer"
        SELLER = "SELLER", "Seller / Vendor"
        EXPERT = "EXPERT", "Agricultural Expert"
        STAFF = "STAFF", "Staff"
        ADMIN = "ADMIN", "Administrator"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True, db_index=True, null=True, blank=True)
    phone = models.CharField(max_length=20, unique=True, db_index=True, null=True, blank=True)
    first_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.FARMER,
        db_index=True,
    )

    location = models.CharField(
        max_length=255,
        blank=True,
        default="Indore, Madhya Pradesh",
    )
    mandi = models.CharField(max_length=255, blank=True, default="Indore Grain Mandi")
    land_area_acres = models.FloatField(default=5.0, blank=True, null=True)
    primary_crops = models.CharField(max_length=255, blank=True, default="Wheat & Soybean")
    company_name = models.CharField(max_length=255, blank=True, default="")
    gstin = models.CharField(max_length=50, blank=True, default="")

    is_verified = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    @property
    def name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else (self.phone or self.email or "AgriMart User")

    def __str__(self):
        return self.phone or self.email or str(self.id)


class OTPVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, db_index=True)
    otp_code = models.CharField(max_length=10, default="123456")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_verified and timezone.now() <= self.expires_at

    def __str__(self):
        # Never put the OTP itself in logs or admin/debug output.
        return f"OTP verification for {self.phone}"

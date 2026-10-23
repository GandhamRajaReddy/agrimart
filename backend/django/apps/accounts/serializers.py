from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# Public self-registration is intentionally limited to these roles.
# EXPERT accounts require review; STAFF and ADMIN are assigned by an authorized administrator.
PUBLIC_ROLE_ALIASES = {
    "FARMER": User.Role.FARMER,
    "BUYER": User.Role.BUYER,
    "SELLER": User.Role.SELLER,
    "VENDOR": User.Role.SELLER,
    "MERCHANT": User.Role.SELLER,
}


def normalize_public_role(value):
    role = str(value or "FARMER").strip().upper()
    try:
        return PUBLIC_ROLE_ALIASES[role]
    except KeyError:
        raise serializers.ValidationError(
            "This role cannot be selected during public registration. "
            "Choose Farmer, Buyer, or Seller/Vendor."
        )


class UserSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "first_name",
            "last_name",
            "role",
            "location",
            "district",
            "taluk",
            "village",
            "mandi",
            "land_area_acres",
            "primary_crops",
            "company_name",
            "gstin",
            "is_verified",
            "date_joined",
        ]


class RequestOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True, max_length=20)
    role = serializers.CharField(required=False, default="FARMER")

    def validate_role(self, value):
        return normalize_public_role(value)


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True, max_length=20)
    otp = serializers.CharField(required=True, min_length=6, max_length=6)
    role = serializers.CharField(required=False, default="FARMER")
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=200)
    email = serializers.EmailField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True, max_length=100)
    district = serializers.CharField(required=False, allow_blank=True, max_length=100)
    mandi = serializers.CharField(required=False, allow_blank=True, max_length=255)
    company_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    gstin = serializers.CharField(required=False, allow_blank=True, max_length=50)
    land_area_acres = serializers.FloatField(required=False, min_value=0)
    primary_crop = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def validate_role(self, value):
        return normalize_public_role(value)


class LoginSerializer(serializers.Serializer):
    phone_or_email = serializers.CharField(required=True, max_length=255)
    password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)


class RegisterSerializer(serializers.Serializer):
    role = serializers.CharField(required=False, default="FARMER")
    full_name = serializers.CharField(required=True, max_length=200)
    phone = serializers.CharField(required=True, max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True, max_length=100)
    district = serializers.CharField(required=False, allow_blank=True, max_length=100)
    mandi = serializers.CharField(required=False, allow_blank=True, max_length=255)
    land_area_acres = serializers.FloatField(required=False, default=5.0, min_value=0)
    primary_crop = serializers.CharField(required=False, allow_blank=True, max_length=255)
    company_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    gstin = serializers.CharField(required=False, allow_blank=True, max_length=50)

    def validate_role(self, value):
        return normalize_public_role(value)

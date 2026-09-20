from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'first_name',
            'last_name',
            'role',
            'location',
            'mandi',
            'land_area_acres',
            'primary_crops',
            'company_name',
            'gstin',
            'is_verified',
            'date_joined',
        ]


class RequestOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    role = serializers.CharField(required=False, default="FARMER")


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    otp = serializers.CharField(required=True)
    role = serializers.CharField(required=False, default="FARMER")
    full_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    mandi = serializers.CharField(required=False, allow_blank=True)


class LoginSerializer(serializers.Serializer):
    phone_or_email = serializers.CharField(required=True)
    password = serializers.CharField(required=False, allow_blank=True)


class RegisterSerializer(serializers.Serializer):
    role = serializers.CharField(required=False, default="FARMER")
    full_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    mandi = serializers.CharField(required=False, allow_blank=True)
    land_area_acres = serializers.FloatField(required=False, default=5.0)
    primary_crop = serializers.CharField(required=False, allow_blank=True)
    company_name = serializers.CharField(required=False, allow_blank=True)
    gstin = serializers.CharField(required=False, allow_blank=True)

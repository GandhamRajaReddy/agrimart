import secrets
import string

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPVerification
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    RequestOTPSerializer,
    UserSerializer,
    VerifyOTPSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


def normalize_phone(value):
    # Normalize common user-entered formats such as +91 98765-43210.
    phone = "".join(character for character in str(value) if character.isdigit())
    if len(phone) == 12 and phone.startswith("91"):
        phone = phone[2:]
    return phone


def make_otp():
    return "".join(secrets.choice(string.digits) for _ in range(6))


def auth_response(user, message):
    tokens = get_tokens_for_user(user)
    return Response(
        {
            "success": True,
            "token": tokens["access"],
            "access": tokens["access"],
            "refresh_token": tokens["refresh"],
            "refresh": tokens["refresh"],
            "user": UserSerializer(user).data,
            "message": message,
        },
        status=status.HTTP_200_OK,
    )


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = normalize_phone(serializer.validated_data["phone"])

        if not phone or len(phone) < 10:
            return Response(
                {"detail": "Enter a valid phone number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # A real SMS provider must be configured before OTP login is enabled
        # outside development. Never claim an OTP was delivered when it was not.
        if not settings.DEBUG:
            return Response(
                {"detail": "OTP delivery is not configured. Use password login for now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        otp_code = make_otp()
        record, _ = OTPVerification.objects.update_or_create(
            phone=phone,
            defaults={
                "otp_code": otp_code,
                "is_verified": False,
                "expires_at": timezone.now() + timezone.timedelta(minutes=10),
            },
        )
        payload = {
            "success": True,
            "message": "Development OTP generated. SMS delivery is not configured.",
            "otp_ref_id": str(record.id),
        }
        # Development-only convenience. This is never included in production.
        if settings.DEBUG:
            payload["demo_otp"] = otp_code
        return Response(payload, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        phone = normalize_phone(data["phone"])
        otp_record = OTPVerification.objects.filter(
            phone=phone,
            otp_code=data["otp"],
            is_verified=False,
            expires_at__gte=timezone.now(),
        ).first()

        if not otp_record:
            return Response(
                {"success": False, "message": "Invalid or expired OTP code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        full_name = (data.get("full_name") or "").strip()
        if not full_name:
            full_name = (request.data.get("fullName") or "").strip()
        if not full_name:
            full_name = "AgriMart User"

        email = (data.get("email") or "").strip().lower()
        if not email:
            email = f"user_{phone}@agrimart.in"

        role = data["role"]
        state = data.get("state") or "Karnataka"
        district = data.get("district") or ""
        taluk = data.get("taluk") or ""
        village = data.get("village") or ""
        location = ", ".join(part for part in (village, taluk, district, state) if part)

        try:
            with transaction.atomic():
                user = User.objects.filter(phone=phone).first()
                if user is None:
                    if User.objects.filter(email=email).exists():
                        return Response(
                            {"detail": "An account with this email already exists."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    user = User.objects.create_user(
                        email=email,
                        password=None,
                        phone=phone,
                        first_name=full_name[:100],
                        role=role,
                        location=location,
                        district=district,
                        taluk=taluk,
                        village=village,
                        mandi=data.get("mandi") or "",
                        land_area_acres=data.get("land_area_acres", 5.0),
                        primary_crops=data.get("primary_crop") or "Wheat & Soybean",
                        company_name=data.get("company_name") or "",
                        gstin=data.get("gstin") or "",
                        is_verified=True,
                    )
                else:
                    if not user.is_active:
                        return Response(
                            {"detail": "This account is inactive. Contact support."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                    # OTP login must not silently change an existing account's role.
                    if user.role != role:
                        return Response(
                            {"detail": "The selected role does not match this account."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                otp_record.is_verified = True
                otp_record.save(update_fields=["is_verified"])
        except IntegrityError:
            return Response(
                {"detail": "An account with these details already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_active:
            return Response(
                {"detail": "This account is inactive. Contact support."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return auth_response(user, "Authentication successful")


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data["phone_or_email"].strip()
        password = serializer.validated_data["password"]
        cleaned_phone = normalize_phone(identifier)

        user = User.objects.filter(email__iexact=identifier).first()
        if user is None:
            user = User.objects.filter(phone=cleaned_phone).first()

        # Do not create accounts or issue tokens when credentials are invalid.
        if user is None or not user.check_password(password):
            return Response(
                {"success": False, "message": "Invalid email/phone or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {"success": False, "message": "This account is inactive. Contact support."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return auth_response(user, "Logged in successfully")


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        phone = normalize_phone(data["phone"])
        email = (data.get("email") or "").strip().lower()
        if not phone or len(phone) != 10 or not phone.isdigit():
            return Response(
                {"detail": "Enter a valid 10-digit Indian mobile number."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(phone=phone).exists():
            return Response(
                {"detail": "An account with this phone number already exists. Please log in."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if email and User.objects.filter(email__iexact=email).exists():
            return Response(
                {"detail": "An account with this email already exists. Please log in."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Email is optional in the registration UI; the custom user model still
        # needs a unique login email, so create a private phone-based alias.
        if not email:
            email = f"user_{phone}@agrimart.in"

        full_name = data["full_name"].strip()
        name_parts = full_name.split(maxsplit=1)
        district = data["district"]
        taluk = data["taluk"]
        village = data["village"]
        state = data.get("state") or "Karnataka"
        location = ", ".join(part for part in (village, taluk, district, state) if part)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    email=email,
                    password=data["password"],
                    phone=phone,
                    first_name=name_parts[0][:100],
                    last_name=name_parts[1][:100] if len(name_parts) > 1 else "",
                    role=data["role"],
                    location=location,
                    district=district,
                    taluk=taluk,
                    village=village,
                    mandi=data.get("mandi") or "",
                    land_area_acres=data.get("land_area_acres", 5.0),
                    primary_crops=data.get("primary_crop") or "",
                    company_name=data.get("company_name") or "",
                    gstin=data.get("gstin") or "",
                    is_verified=False,
                )
        except IntegrityError:
            return Response(
                {"detail": "An account with these details already exists. Please log in."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return auth_response(user, "Account created successfully. You are now logged in.")

class UserMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh_token") or request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"success": False, "message": "A refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception:
            return Response(
                {"success": False, "message": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"success": True, "message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )

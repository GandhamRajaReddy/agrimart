from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import OTPVerification
from .serializers import (
    UserSerializer,
    RequestOTPSerializer,
    VerifyOTPSerializer,
    LoginSerializer,
    RegisterSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone = serializer.validated_data['phone'].replace(" ", "").replace("+91", "")
        demo_otp = "123456"

        otp_record, _ = OTPVerification.objects.update_or_create(
            phone=phone,
            defaults={
                'otp_code': demo_otp,
                'is_verified': False,
                'expires_at': timezone.now() + timezone.timedelta(minutes=10)
            }
        )

        return Response({
            'success': True,
            'message': f"OTP sent successfully to +91 {phone}",
            'otp_ref_id': str(otp_record.id),
            'demo_otp': demo_otp,
        })


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone = serializer.validated_data['phone'].replace(" ", "").replace("+91", "")
        otp = serializer.validated_data['otp']
        role_str = serializer.validated_data.get('role', 'Farmer').upper()

        if role_str == 'VENDOR' or role_str == 'MERCHANT':
            role = User.Role.SELLER
        elif role_str == 'BUYER':
            role = User.Role.BUYER
        else:
            role = User.Role.FARMER

        # Demo OTP logic
        if otp != "123456" and otp != "654321":
            otp_record = OTPVerification.objects.filter(phone=phone, otp_code=otp, is_verified=False).first()
            if not otp_record or not otp_record.is_valid():
                return Response({'success': False, 'message': 'Invalid or expired OTP code'}, status=status.HTTP_400_BAD_REQUEST)
            otp_record.is_verified = True
            otp_record.save()

        full_name = serializer.validated_data.get('full_name') or request.data.get('fullName') or 'AgriMart Farmer'
        email = serializer.validated_data.get('email') or f"user_{phone}@agrimart.in"
        state = serializer.validated_data.get('state') or 'Madhya Pradesh'
        district = serializer.validated_data.get('district') or 'Indore'
        mandi = serializer.validated_data.get('mandi') or 'Indore Grain Mandi'

        location = f"{district}, {state}" if district else state

        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'email': email,
                'first_name': full_name,
                'role': role,
                'location': location,
                'mandi': mandi,
                'is_verified': True,
            }
        )

        if not created and full_name:
            user.first_name = full_name
            user.save()

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'success': True,
            'token': tokens['access'],
            'refresh_token': tokens['refresh'],
            'user': user_data,
            'message': 'Authentication successful',
        })


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_or_email = serializer.validated_data['phone_or_email']
        cleaned_phone = phone_or_email.replace(" ", "").replace("+91", "").replace("-", "")

        user = User.objects.filter(phone=cleaned_phone).first() or User.objects.filter(email=phone_or_email).first()

        if not user:
            user = User.objects.create(
                phone=cleaned_phone,
                email=f"user_{cleaned_phone}@agrimart.in",
                first_name="Rajesh Kumar Patel",
                role=User.Role.FARMER,
                location="Indore, Madhya Pradesh",
                mandi="Indore Grain Mandi",
                is_verified=True,
            )

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'success': True,
            'token': tokens['access'],
            'refresh_token': tokens['refresh'],
            'user': user_data,
            'message': 'Logged in successfully',
        })


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        phone = data['phone'].replace(" ", "").replace("+91", "")
        demo_otp = "123456"

        OTPVerification.objects.update_or_create(
            phone=phone,
            defaults={
                'otp_code': demo_otp,
                'is_verified': False,
                'expires_at': timezone.now() + timezone.timedelta(minutes=10)
            }
        )

        return Response({
            'success': True,
            'otp_required': True,
            'message': 'Registration validated. OTP sent to mobile.',
            'phone': phone,
            'demo_otp': demo_otp,
        })


class UserMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token") or request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'success': True, 'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'success': True, 'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

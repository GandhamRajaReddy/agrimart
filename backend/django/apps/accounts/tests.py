from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import OTPVerification, User
from .serializers import RegisterSerializer


class AuthenticationSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="farmer@example.com",
            password="Correct-Horse-Battery-42!",
            phone="9876543210",
            first_name="Test Farmer",
            role=User.Role.FARMER,
        )

    def test_password_login_returns_user_role_and_tokens(self):
        response = self.client.post(
            "/api/v1/auth/login/",
            {
                "phone_or_email": "farmer@example.com",
                "password": "Correct-Horse-Battery-42!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertIn("refresh_token", response.data)
        self.assertEqual(response.data["user"]["role"], User.Role.FARMER)

    def test_invalid_password_does_not_issue_tokens_or_create_account(self):
        before = User.objects.count()
        response = self.client.post(
            "/api/v1/auth/login/",
            {"phone_or_email": "unknown@example.com", "password": "wrong-password"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertNotIn("token", response.data)
        self.assertEqual(User.objects.count(), before)

    def test_public_registration_rejects_privileged_roles(self):
        serializer = RegisterSerializer(
            data={
                "full_name": "Unauthorized Admin",
                "phone": "9123456789",
                "email": "bad-admin@example.com",
                "role": "ADMIN",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("role", serializer.errors)

    def test_fixed_demo_otp_cannot_authenticate_without_a_saved_code(self):
        response = self.client.post(
            "/api/v1/auth/verify-otp/",
            {"phone": "9999999999", "otp": "123456", "role": "FARMER"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertNotIn("token", response.data)
        self.assertFalse(User.objects.filter(phone="9999999999").exists())
        self.assertFalse(OTPVerification.objects.filter(phone="9999999999").exists())

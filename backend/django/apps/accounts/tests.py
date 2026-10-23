from django.test import TestCase
from unittest.mock import patch
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

    def test_password_login_accepts_phone_number(self):
        response = self.client.post(
            "/api/v1/auth/login/",
            {
                "phone_or_email": "+91 98765-43210",
                "password": "Correct-Horse-Battery-42!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["phone"], "9876543210")

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

    @patch("apps.accounts.serializers.validate_karnataka_location")
    def test_registration_creates_password_account_without_otp(self, validate_location):
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "full_name": "New Farmer",
                "phone": "9988776655",
                "email": "newfarmer@example.com",
                "password": "StrongPass123!",
                "role": "Farmer",
                "state": "Karnataka",
                "district": "Mysuru",
                "taluk": "Hunsur",
                "village": "Example Village",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("token", response.data)
        self.assertIn("refresh_token", response.data)
        self.assertNotIn("password", response.data)
        user = User.objects.get(phone="9988776655")
        self.assertTrue(user.check_password("StrongPass123!"))
        self.assertFalse(OTPVerification.objects.filter(phone="9988776655").exists())

    def test_registration_rejects_short_password(self):
        serializer = RegisterSerializer(data={"password": "short"})
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

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

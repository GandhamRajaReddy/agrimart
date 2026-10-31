from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User


class MarketReadinessTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_market_status_is_public_and_does_not_claim_forecasts(self):
        response = self.client.get("/api/v1/market/status/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["region"], "Karnataka")
        self.assertFalse(response.data["historical_data_available"])
        self.assertFalse(response.data["forecasts_available"])

    def test_crop_plan_requires_authentication(self):
        response = self.client.post(
            "/api/v1/market/crop-plan/",
            {"district": "Mysuru", "land_area_acres": 2},
            format="json",
        )

        self.assertEqual(response.status_code, 401)

    def test_crop_plan_fails_closed_for_authenticated_user(self):
        user = User.objects.create_user(
            email="market-farmer@example.com",
            password="StrongPass123!",
            phone="9876501234",
            first_name="Market Farmer",
            role=User.Role.FARMER,
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/v1/market/crop-plan/",
            {"district": "Mysuru", "land_area_acres": 2},
            format="json",
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["code"], "CROP_PLAN_NOT_READY")

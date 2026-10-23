from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.serializers import RegisterSerializer


class KarnatakaLocationsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_districts_are_karnataka_only(self):
        response = self.client.get("/api/v1/locations/karnataka/", {"level": "district"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["state"], "Karnataka")
        self.assertEqual(len(response.data["results"]), 31)
        self.assertIn("Bengaluru Urban", [row["name"] for row in response.data["results"]])

    def test_taluks_can_be_filtered_by_district(self):
        response = self.client.get("/api/v1/locations/karnataka/", {"level": "taluk", "district": "Mysuru"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["results"])
        self.assertTrue(all(row["name"] for row in response.data["results"]))

    def test_registration_rejects_other_states(self):
        serializer = RegisterSerializer(data={
            "full_name": "Test User", "phone": "9876543210", "state": "Maharashtra",
            "district": "Pune", "taluk": "Pune", "village": "Sample", "role": "FARMER",
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn("state", serializer.errors)

    @patch("apps.locations.api_views.load_villages")
    def test_village_endpoint_returns_all_villages_for_selected_taluk(self, load_villages):
        load_villages.return_value = [
            {"code": str(index), "name": f"Village {index:03}", "district": "Mysuru",
             "taluk": "Mysuru", "pincode": ""}
            for index in range(250)
        ]
        response = self.client.get("/api/v1/locations/karnataka/", {
            "level": "village", "district": "Mysuru", "taluk": "Mysuru",
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 250)
        self.assertEqual(len(response.data["results"]), 250)
        self.assertTrue(response.data["data_ready"])

    @patch("apps.locations.api_views.load_villages")
    def test_village_search_filters_all_taluk_villages(self, load_villages):
        load_villages.return_value = [
            {"code": "1", "name": "Mysuru North", "district": "Mysuru", "taluk": "Mysuru", "pincode": ""},
            {"code": "2", "name": "Mysuru South", "district": "Mysuru", "taluk": "Mysuru", "pincode": ""},
            {"code": "3", "name": "Hunsur", "district": "Mysuru", "taluk": "Mysuru", "pincode": ""},
        ]
        response = self.client.get("/api/v1/locations/karnataka/", {
            "level": "village", "district": "Mysuru", "taluk": "Mysuru", "search": "North",
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["name"] for row in response.data["results"]], ["Mysuru North"])

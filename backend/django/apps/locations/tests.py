from django.test import TestCase
from rest_framework.test import APIClient


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

    def test_village_search_requires_district_taluk_and_two_characters(self):
        response = self.client.get("/api/v1/locations/karnataka/", {"level": "village", "district": "Mysuru", "taluk": "Mysuru", "search": "M"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"], [])
        self.assertEqual(response.data["search_min_length"], 2)

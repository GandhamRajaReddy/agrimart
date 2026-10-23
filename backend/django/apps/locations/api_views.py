import json
from functools import lru_cache
from pathlib import Path

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


DATA_DIR = Path(__file__).resolve().parent / "data"

# Karnataka APMC markets. This district-level reference is a practical suggestion,
# not a distance calculation; precise nearest-market results require geocoded data.
MANDIS_BY_DISTRICT = {
    "Bagalkote": ["Bagalkot APMC", "Badami APMC", "Hungund APMC", "Jamakhandi APMC", "Mudhol APMC"],
    "Ballari": ["Ballari APMC", "Siruguppa APMC"],
    "Belagavi": ["Belgaum APMC", "Athani APMC", "Bailahongal APMC", "Nippani APMC", "Ramdurga APMC"],
    "Bengaluru Rural": ["Doddaballapur APMC", "Hoskote APMC"],
    "Bengaluru South": ["Ramanagara APMC", "Channapatna APMC", "Kanakapura APMC"],
    "Bengaluru Urban": ["Bengaluru APMC", "Binny Mill Fruit and Vegetable APMC"],
    "Bidar": ["Bidar APMC", "Aurad APMC", "Bhalki APMC", "Basavakalyan APMC", "Humanabad APMC"],
    "Chamarajanagar": ["Chamarajanagar APMC", "Gundlupet APMC", "Kollegal APMC"],
    "Chikkaballapura": ["Chikkaballapura APMC", "Bagepalli APMC", "Chintamani APMC", "Gauribidanur APMC"],
    "Chikkamagaluru": ["Chikkamagaluru APMC", "Kadur APMC", "Tarikere APMC", "Mudigere APMC", "Koppa APMC"],
    "Chitradurga": ["Chitradurga APMC", "Challakere APMC", "Hiriyur APMC", "Holalkere APMC", "Hosadurga APMC"],
    "Dakshina Kannada": ["Mangaluru APMC", "Bantwal APMC", "Puttur APMC", "Sulya APMC"],
    "Davanagere": ["Davanagere APMC", "Channagiri APMC", "Harihara APMC", "Honnali APMC", "Jagalur APMC"],
    "Dharwad": ["Hubballi APMC", "Dharwad APMC", "Kalghatgi APMC"],
    "Gadag": ["Gadag APMC", "Laxmeshwar APMC", "Mundargi APMC", "Ron APMC"],
    "Hassan": ["Hassan APMC", "Arasikere APMC", "Belur APMC", "Sakleshpur APMC"],
    "Haveri": ["Haveri APMC", "Byadagi APMC", "Ranebennur APMC", "Savanur APMC"],
    "Kalaburagi": ["Kalaburagi APMC", "Chincholi APMC", "Afzalpur APMC"],
    "Kodagu": ["Gonikoppal APMC", "Somwarpet APMC", "Madikeri APMC"],
    "Kolar": ["Kolar APMC", "Bangarpet APMC", "Malur APMC", "Mulbagal APMC", "Srinivasapur APMC"],
    "Koppal": ["Koppal APMC", "Gangavathi APMC", "Kustagi APMC", "Yelburga APMC"],
    "Mandya": ["Mandya APMC", "Maddur APMC", "Malavalli APMC", "Nagamangala APMC", "K.R. Pet APMC", "Pandavapura APMC"],
    "Mysuru": ["Mysuru APMC", "Hunsur APMC", "Nanjangud APMC", "T. Narasipura APMC", "K.R. Nagar APMC"],
    "Raichur": ["Raichur APMC", "Lingasugur APMC", "Sindhanur APMC"],
    "Shivamogga": ["Shivamogga APMC", "Sagar APMC", "Shikaripura APMC", "Thirthahalli APMC"],
    "Tumakuru": ["Tumakuru APMC", "Tiptur APMC", "Kunigal APMC", "Sira APMC", "Turuvekere APMC"],
    "Udupi": ["Udupi APMC", "Karkala APMC", "Kundapura APMC"],
    "Uttara Kannada": ["Sirsi APMC", "Kumta APMC", "Haliyal APMC", "Siddapur APMC", "Yellapur APMC"],
    "Vijayanagara": ["Hospet APMC", "H.B. Halli APMC", "Kottur APMC", "Kudligi APMC"],
    "Vijayapura": ["Vijayapura APMC", "Talikot APMC", "Sindagi APMC"],
    "Yadgir": ["Yadgir APMC", "Shahapur APMC", "Shorapur APMC"],
}

@lru_cache(maxsize=1)
def load_regions():
    with (DATA_DIR / "karnataka_regions.json").open(encoding="utf-8") as handle:
        return json.load(handle)


@lru_cache(maxsize=1)
def load_villages():
    path = DATA_DIR / "karnataka_villages.json"
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


class KarnatakaLocationsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        regions = load_regions()
        level = request.query_params.get("level", "district").lower()
        district = request.query_params.get("district", "").strip()
        taluk = request.query_params.get("taluk", "").strip()
        search = request.query_params.get("search", "").strip()

        if level == "district":
            return Response({
                "state": "Karnataka",
                "results": [
                    {"code": item["code"], "name": item["name"]}
                    for item in regions["districts"]
                ],
            })

        if level == "taluk":
            results = [
                {"code": item["code"], "name": item["name"]}
                for item in regions["taluks"]
                if not district or item["district"].casefold() == district.casefold()
            ]
            return Response({"state": "Karnataka", "results": results})

        if level == "mandi":
            district_row = next(
                (item for item in regions["districts"] if item["name"].casefold() == district.casefold()),
                None,
            )
            if not district_row:
                return Response({"state": "Karnataka", "results": [], "suggested": None})
            markets = MANDIS_BY_DISTRICT.get(district_row["name"], [])
            # Prefer a market whose name matches the selected taluk, otherwise use
            # the first known APMC in the district as a helpful starting suggestion.
            suggested = next(
                (market for market in markets if taluk and taluk.casefold() in market.casefold()),
                markets[0] if markets else None,
            )
            return Response({
                "state": "Karnataka",
                "results": [{"name": market} for market in markets],
                "suggested": suggested,
                "suggestion_basis": "district_and_taluk",
            })

        if level == "village":
            if not district or not taluk:
                return Response({
                    "state": "Karnataka", "results": [], "count": 0,
                    "detail": "Select a district and taluk to list villages.",
                })

            villages = load_villages()
            if not villages:
                return Response({
                    "state": "Karnataka", "results": [], "count": 0,
                    "data_ready": False,
                })

            rows = [
                row for row in villages
                if row["district"].casefold() == district.casefold()
                and row["taluk"].casefold() == taluk.casefold()
                and (not search or search.casefold() in row["name"].casefold())
            ]
            rows.sort(key=lambda row: row["name"].casefold())
            return Response({
                "state": "Karnataka",
                "results": rows,
                "count": len(rows),
                "data_ready": True,
            })

        return Response({"detail": "Unsupported location level."}, status=400)

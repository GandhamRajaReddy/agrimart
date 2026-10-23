import json
from functools import lru_cache
from pathlib import Path

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


DATA_DIR = Path(__file__).resolve().parent / "data"


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

import csv
import json
import urllib.request
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError


SOURCE_URL = (
    "https://raw.githubusercontent.com/mchittineni/india-village-finder/"
    "main/karnataka/data/karnataka_villages.csv"
)
DATA_DIR = Path(__file__).resolve().parents[2] / "data"
OUTPUT_PATH = DATA_DIR / "karnataka_villages.json"


class Command(BaseCommand):
    help = "Download and prepare Karnataka village data sourced from LGD."

    def handle(self, *args, **options):
        request = urllib.request.Request(
            SOURCE_URL,
            headers={"User-Agent": "AgriMart-location-data-sync/1.0"},
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                text = response.read().decode("utf-8-sig")
        except Exception as exc:
            raise CommandError(f"Could not download Karnataka village data: {exc}") from exc

        reader = csv.DictReader(text.splitlines())
        required = {"District", "Mandal", "Village", "Village Code"}
        if not reader.fieldnames or not required.issubset(set(reader.fieldnames)):
            raise CommandError(
                "The source CSV schema changed; expected District, Mandal, Village, Village Code."
            )

        villages = []
        seen = set()
        for row in reader:
            name = (row.get("Village") or "").strip()
            district = (row.get("District") or "").strip()
            taluk = (row.get("Mandal") or "").strip()
            code = (row.get("Village Code") or "").strip()
            if not name or not district or not taluk or not code:
                continue
            identity = (code, district, taluk, name)
            if identity in seen:
                continue
            seen.add(identity)
            villages.append({
                "code": code,
                "name": name,
                "district": district,
                "taluk": taluk,
                "pincode": (row.get("Pincode") or "").strip(),
            })

        if not villages:
            raise CommandError("The source contained no valid Karnataka villages.")
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(
            json.dumps(villages, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        self.stdout.write(self.style.SUCCESS(
            f"Saved {len(villages):,} village records to {OUTPUT_PATH}"
        ))

import requests
from django.conf import settings
from requests.exceptions import RequestException


class MLServiceUnavailable(Exception):
    """Raised when the private Harvestify service cannot be reached."""


def call_ml(method, path, **kwargs):
    if not getattr(settings, "ML_SERVICE_ENABLED", False):
        raise MLServiceUnavailable("ML service disabled")

    base_url = getattr(settings, "ML_SERVICE_URL", "").rstrip("/")
    if not base_url:
        raise MLServiceUnavailable("ML service URL missing")

    timeout = (
        getattr(settings, "ML_CONNECT_TIMEOUT", 2),
        getattr(settings, "ML_READ_TIMEOUT", 20),
    )
    try:
        response = requests.request(
            method,
            f"{base_url}{path}",
            timeout=timeout,
            **kwargs,
        )
        response.raise_for_status()
        return response.json()
    except (RequestException, ValueError) as exc:
        raise MLServiceUnavailable("ML service unavailable") from exc


def fertilizer(payload):
    return call_ml("POST", "/api/v1/fertilizer/recommend", json=payload)


def disease(upload):
    upload.seek(0)
    return call_ml(
        "POST",
        "/api/v1/disease/predict",
        files={"file": (upload.name, upload, upload.content_type)},
    )


def health():
    return call_ml("GET", "/health/ready")

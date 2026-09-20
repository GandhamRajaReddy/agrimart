from django.db import connection
from django.http import JsonResponse
from django.utils import timezone


def health_check(request):
    """
    Liveness endpoint.

    Confirms that the Django application process
    is responding.
    """

    return JsonResponse(
        {
            "status": "healthy",
            "service": "agrimart-django",
            "timestamp": timezone.now().isoformat(),
        }
    )


def readiness_check(request):
    """
    Readiness endpoint.

    Confirms that Django can communicate with PostgreSQL.
    """

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return JsonResponse(
            {
                "status": "ready",
                "service": "agrimart-django",
                "database": "connected",
                "timestamp": timezone.now().isoformat(),
            }
        )

    except Exception:
        return JsonResponse(
            {
                "status": "not_ready",
                "service": "agrimart-django",
                "database": "unavailable",
                "timestamp": timezone.now().isoformat(),
            },
            status=503,
        )
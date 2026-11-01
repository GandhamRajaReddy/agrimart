from django.core.exceptions import ImproperlyConfigured

from .base import *


# Production must never run with the development-only signing key.
_DEVELOPMENT_SECRET_KEY = "django-insecure-development-key-change-this"
if not SECRET_KEY or SECRET_KEY == _DEVELOPMENT_SECRET_KEY:
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY must be explicitly configured with a unique "
        "production secret before starting AgriMart in production."
    )


DEBUG = False

ALLOWED_HOSTS = config(
    "DJANGO_ALLOWED_HOSTS",
    cast=Csv(),
)


# ============================================================
# SECURITY
# ============================================================

SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_HSTS_SECONDS = 31536000

SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

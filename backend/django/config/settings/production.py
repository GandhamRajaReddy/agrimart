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
    default="localhost,127.0.0.1",
    cast=Csv(),
)


# ============================================================
# SECURITY & REVERSE PROXY
# ============================================================

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_HSTS_SECONDS = config("DJANGO_SECURE_HSTS_SECONDS", default=31536000, cast=int)

SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_SECURE = config("DJANGO_SESSION_COOKIE_SECURE", default=True, cast=bool)

CSRF_COOKIE_SECURE = config("DJANGO_CSRF_COOKIE_SECURE", default=True, cast=bool)

SECURE_SSL_REDIRECT = config("DJANGO_SECURE_SSL_REDIRECT", default=False, cast=bool)

# Support CSRF trusted origins for domain deployments
_configured_csrf = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in _configured_csrf if origin.strip()]

from pathlib import Path
from decouple import config, Csv
from datetime import timedelta


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = config(
    "DJANGO_SECRET_KEY",
    default="django-insecure-development-key-change-this",
)

DEBUG = config("DJANGO_DEBUG", default=False, cast=bool)


ALLOWED_HOSTS = config(
    "DJANGO_ALLOWED_HOSTS",
    default="localhost,127.0.0.1",
    cast=Csv(),
)


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "corsheaders",
    "drf_spectacular",
    

    # AgriMart apps
    "apps.accounts",
    "apps.locations",
    "apps.products",
    "apps.categories",
    "apps.inventory",
    "apps.cart",
    "apps.orders",
    "apps.payments",
    "apps.procurement",
    "apps.market",
    "apps.notifications",
    "apps.ml_gateway",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # CORS
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL CONFIGURATION
# ============================================================

ROOT_URLCONF = "config.urls"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ============================================================
# WSGI / ASGI
# ============================================================

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


# ============================================================
# DATABASE
# ============================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DATABASE_NAME"),
        "USER": config("DATABASE_USER"),
        "PASSWORD": config("DATABASE_PASSWORD"),
        "HOST": config("DATABASE_HOST", default="localhost"),
        "PORT": config("DATABASE_PORT", default="5432"),
    }
}


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = "media/"

MEDIA_ROOT = BASE_DIR / "media"


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# CORS
# ============================================================

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://localhost:5176",
    cast=Csv(),
)


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {
    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],

    # --------------------------------------------------------
    # Permissions
    # --------------------------------------------------------
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],

    # --------------------------------------------------------
    # Filtering
    # --------------------------------------------------------
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],

    # --------------------------------------------------------
    # Pagination
    # --------------------------------------------------------
    "DEFAULT_PAGINATION_CLASS": (
        "rest_framework.pagination.PageNumberPagination"
    ),
    "PAGE_SIZE": 20,

    # --------------------------------------------------------
    # Rendering
    # --------------------------------------------------------
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],

    # --------------------------------------------------------
    # Schema
    # --------------------------------------------------------
    "DEFAULT_SCHEMA_CLASS": (
        "drf_spectacular.openapi.AutoSchema"
    ),
}
# ============================================================
# SIMPLE JWT
# ============================================================




SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,

    "UPDATE_LAST_LOGIN": True,

    "ALGORITHM": "HS256",

    "AUTH_HEADER_TYPES": ("Bearer",),

    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",

    "AUTH_TOKEN_CLASSES": (
        "rest_framework_simplejwt.tokens.AccessToken",
    ),
}
# ============================================================
# DRF SPECTACULAR
# ============================================================

SPECTACULAR_SETTINGS = {
    "TITLE": "AgriMart API",
    "DESCRIPTION": (
        "Scalable agricultural e-commerce, procurement, "
        "market intelligence and AI platform."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,

    "CONTACT": {
        "name": "AgriMart Development Team",
    },

    "LICENSE": {
        "name": "Proprietary",
    },

    "TAGS": [
        {
            "name": "Health",
            "description": "Service health and readiness endpoints.",
        },
        {
            "name": "Authentication",
            "description": "User authentication and authorization.",
        },
        {
            "name": "Products",
            "description": "Agricultural products and catalog.",
        },
        {
            "name": "Procurement",
            "description": "Farmer produce procurement.",
        },
        {
            "name": "Market",
            "description": "Market prices and intelligence.",
        },
    ],
}
# ============================================================
# AUTHENTICATION
# ============================================================

AUTH_USER_MODEL = "accounts.User"

# Optional, isolated ML service gateway
ML_SERVICE_ENABLED = config("ML_SERVICE_ENABLED", default=False, cast=bool)
ML_SERVICE_URL = config("ML_SERVICE_URL", default="http://127.0.0.1:8100")
ML_CONNECT_TIMEOUT = config("ML_CONNECT_TIMEOUT", default=2, cast=int)
ML_READ_TIMEOUT = config("ML_READ_TIMEOUT", default=20, cast=int)

# Market intelligence remains fail-closed until the data pipeline and model pass validation.
DATA_GOV_IN_API_KEY = config("DATA_GOV_IN_API_KEY", default="")
MARKET_FORECAST_MODEL_VALIDATED = config(
    "MARKET_FORECAST_MODEL_VALIDATED", default=False, cast=bool
)

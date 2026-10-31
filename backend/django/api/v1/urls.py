from django.urls import include, path

from .health import health_check, readiness_check
from apps.locations.api_views import KarnatakaLocationsView
from apps.accounts.api_views import (
    RequestOTPView,
    VerifyOTPView,
    LoginView,
    RegisterView,
    UserMeView,
    LogoutView,
)
from apps.categories.api_views import CategoryListView
from apps.products.api_views import ProductListView, FeaturedProductListView
from apps.cart.api_views import (
    CartView,
    CartItemView,
    CartItemDetailView,
    ClearCartView,
)
from apps.orders.api_views import (
    AddressListCreateView,
    AddressDetailView,
    CheckoutSummaryView,
    OrderListCreateView,
    OrderDetailView,
    OrderCancelView,
)

urlpatterns = [
    path("ml/", include("apps.ml_gateway.urls")),
    path("market/", include("apps.market.urls")),
    path(
        "locations/karnataka/",
        KarnatakaLocationsView.as_view(),
        name="karnataka-locations",
    ),
    path("health/", health_check, name="health"),
    path("ready/", readiness_check, name="ready"),
    path("auth/request-otp/", RequestOTPView.as_view(), name="auth-request-otp"),
    path("auth/verify-otp/", VerifyOTPView.as_view(), name="auth-verify-otp"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/me/", UserMeView.as_view(), name="auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("categories/", CategoryListView.as_view(), name="categories-list"),
    path("products/", ProductListView.as_view(), name="products-list"),
    path(
        "products/featured/",
        FeaturedProductListView.as_view(),
        name="products-featured-list",
    ),
    path("cart/", CartView.as_view(), name="cart-detail"),
    path("cart/items/", CartItemView.as_view(), name="cart-item-add"),
    path("cart/items/<uuid:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("cart/clear/", ClearCartView.as_view(), name="cart-clear"),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<uuid:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path("checkout/", CheckoutSummaryView.as_view(), name="checkout-summary"),
    path("orders/", OrderListCreateView.as_view(), name="order-list-create"),
    path("orders/<uuid:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/<uuid:pk>/cancel/", OrderCancelView.as_view(), name="order-cancel"),
]

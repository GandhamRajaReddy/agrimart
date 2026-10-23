import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, Sparkles, X, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "../config/routes";
import { mobileQuickLinks, primaryNavigation } from "../routes/routeConfig";
import { toggleCartDrawer } from "../store/cartSlice";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";

const navigationLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
    isActive
      ? "bg-[#eaf0e7] text-[#1d4b34]"
      : "text-[#45604f] hover:bg-[#f6f5ef] hover:text-[#163124]"
  }`;

export const Navbar = ({ onOpenAiAssistant }) => {
  const dispatch = useDispatch();
  const { itemCount } = useCart();
  const cartCount = itemCount;
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const role = String(user?.role || "").trim().toUpperCase();
  const roleNavigation = {
    FARMER: primaryNavigation,
    BUYER: [
      { label: "Buy produce", to: ROUTES.procurement, icon: ShoppingBag },
      { label: "Market prices", to: ROUTES.marketIntelligence, icon: LayoutDashboard },
      { label: "My orders", to: ROUTES.orders, icon: ShoppingBag },
    ],
    SELLER: [
      { label: "My products", to: ROUTES.catalog, icon: ShoppingBag },
      { label: "Market prices", to: ROUTES.marketIntelligence, icon: LayoutDashboard },
      { label: "Customer orders", to: ROUTES.orders, icon: ShoppingBag },
    ],
    VENDOR: [
      { label: "My products", to: ROUTES.catalog, icon: ShoppingBag },
      { label: "Market prices", to: ROUTES.marketIntelligence, icon: LayoutDashboard },
      { label: "Customer orders", to: ROUTES.orders, icon: ShoppingBag },
    ],
  };
  const dashboardByRole = {
    FARMER: ROUTES.farmerDashboard,
    BUYER: ROUTES.buyerDashboard,
    SELLER: ROUTES.vendorDashboard,
    VENDOR: ROUTES.vendorDashboard,
    EXPERT: ROUTES.expertDashboard,
    STAFF: ROUTES.staffDashboard,
    ADMIN: ROUTES.admin,
  };
  const navigationItems = isAuthenticated && roleNavigation[role]
    ? roleNavigation[role]
    : primaryNavigation;
  const mobileNavigationItems = isAuthenticated && roleNavigation[role]
    ? [...navigationItems, ...(role === "FARMER" ? [{ label: "Crop health scan", to: ROUTES.aiDetection, icon: LayoutDashboard }] : [])]
    : mobileQuickLinks;


  return (
    <header className="sticky top-0 z-40 border-b border-[#1d4b34]/10 bg-[#f6f5ef]/95 backdrop-blur-lg">
      <div className="content-container flex min-h-18 items-center justify-between gap-3 py-3">
        <Link to={ROUTES.home} className="group flex items-center gap-2.5" aria-label="AgriMart home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1d4b34] text-[#d9e7c7] shadow-[0_8px_18px_rgba(29,75,52,0.22)] transition-transform group-hover:-rotate-6">
            <span className="display-font text-2xl leading-none">a</span>
          </span>
          <span className="leading-none">
            <span className="display-font block text-[1.65rem] font-bold tracking-[-0.05em] text-[#163124]">AgriMart</span>
            <span className="mt-0.5 block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[#5d8f3d]">Grow with clarity</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigationItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={navigationLinkClass}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="hidden min-h-10 items-center gap-2 rounded-xl border border-[#1d4b34]/12 bg-white px-3 text-sm font-extrabold text-[#1d4b34] shadow-sm transition hover:border-[#5d8f3d]/40 hover:bg-[#eaf0e7] sm:inline-flex"
          >
            <Sparkles className="h-4 w-4 text-[#d68b35]" aria-hidden="true" />
            Ask Agri AI
          </button>

          <button
            type="button"
            onClick={() => dispatch(toggleCartDrawer(true))}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#1d4b34]/12 bg-white text-[#1d4b34] shadow-sm transition hover:border-[#5d8f3d]/40 hover:bg-[#eaf0e7]"
            aria-label={`Open cart${cartCount ? ` with ${cartCount} items` : ""}`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#d68b35] px-1 text-[0.625rem] font-extrabold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#1d4b34]/15 bg-white px-2.5 py-1 text-sm font-bold text-[#163124] shadow-sm hover:bg-[#eaf0e7] transition-all"
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#1d4b34] text-xs font-black text-[#d9e7c7]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden text-left text-xs xl:block">
                  <span className="block font-bold leading-tight text-[#163124]">{user.name}</span>
                  <span className="block text-[10px] font-semibold text-[#5d8f3d]">{user.role || 'Farmer'}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#587062]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#1d4b34]/15 bg-white p-3 shadow-xl z-50 text-xs space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#f6f5ef] border border-[#1d4b34]/10">
                    <p className="font-bold text-[#163124] text-sm">{user.name}</p>
                    <p className="text-[#5d8f3d] text-xs font-semibold">{user.role || 'Farmer'}</p>
                    <p className="text-[#587062] text-[10px] mt-0.5">{user.location || user.mandi || 'India'}</p>
                  </div>

                  <div className="pt-1 border-t border-[#1d4b34]/10 space-y-1">
                    <Link
                      to={dashboardByRole[role] || ROUTES.home}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#163124] hover:bg-[#eaf0e7] font-semibold transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#1d4b34]" />
                      <span>My Dashboard</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={ROUTES.login}
              className="hidden min-h-10 items-center rounded-xl bg-[#1d4b34] px-3.5 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(29,75,52,0.18)] transition hover:-translate-y-0.5 hover:bg-[#163c2a] sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl text-[#1d4b34] transition hover:bg-[#eaf0e7] lg:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-[#1d4b34]/10 bg-[#f6f5ef] lg:hidden">
          <nav className="content-container grid gap-1 py-4" aria-label="Mobile navigation">
            {mobileNavigationItems.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} className={navigationLinkClass} onClick={() => setIsMenuOpen(false)}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#1d4b34]/10 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAiAssistant?.();
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#1d4b34]/15 bg-white px-3 text-sm font-extrabold text-[#1d4b34]"
              >
                <Sparkles className="h-4 w-4 text-[#d68b35]" aria-hidden="true" />
                Ask Agri AI
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 text-sm font-extrabold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <Link to={ROUTES.login} onClick={() => setIsMenuOpen(false)} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#1d4b34] px-3 text-sm font-extrabold text-white">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

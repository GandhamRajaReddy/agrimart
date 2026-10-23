import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CatalogPage } from '../pages/CatalogPage';
import { AIDetectionPage } from '../pages/AIDetectionPage';
import { MarketIntelligencePage } from '../pages/MarketIntelligencePage';
import { CropPlannerPage } from '../features/crop-intelligence/pages/CropPlannerPage';
import { ProcurementPage } from '../pages/ProcurementPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { OrderDetailsPage } from '../features/orders/pages/OrderDetailsPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { LoginPage, RegisterPage } from '../features/auth';
import HomePage from '../features/home/pages/HomePage';
import { ROUTES } from '../config/routes';
import NotFoundPage from '../pages/NotFoundPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const getRole = (user) => String(user?.role || '').trim().toUpperCase();

const RequireAuth = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(getRole(user))) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return children;
};

const HomeRedirect = ({ onOpenAiAssistant }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  if (!isAuthenticated) return <HomePage onOpenAiAssistant={onOpenAiAssistant} />;
  const role = getRole(user);
  const destinations = {
    FARMER: ROUTES.farmerDashboard,
    BUYER: ROUTES.buyerDashboard,
    SELLER: ROUTES.vendorDashboard,
    EXPERT: ROUTES.expertDashboard,
    STAFF: ROUTES.staffDashboard,
    ADMIN: ROUTES.admin,
  };
  return <Navigate to={destinations[role] || ROUTES.unauthorized} replace />;
};

const RoleDashboard = ({ title, description, links }) => (
  <main className="mx-auto max-w-6xl px-4 py-10">
    <div className="rounded-3xl border border-emerald-800/60 bg-emerald-950/50 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">AgriMart workspace</p>
      <h1 className="mt-2 text-3xl font-extrabold text-white">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-emerald-100/80">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="rounded-xl border border-emerald-700/60 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/70">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </main>
);

const Unauthorized = () => (
  <main className="mx-auto max-w-3xl px-4 py-16">
    <div className="rounded-3xl border border-amber-700/50 bg-amber-950/30 p-8">
      <h1 className="text-2xl font-bold text-white">Access restricted</h1>
      <p className="mt-3 text-sm text-amber-100/80">Your account role does not have access to this workspace.</p>
      <a href={ROUTES.home} className="mt-5 inline-block font-semibold text-emerald-300 hover:underline">Go to my workspace</a>
    </div>
  </main>
);

export const AppRoutes = ({ onOpenAiAssistant }) => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path={ROUTES.home} element={<HomeRedirect onOpenAiAssistant={onOpenAiAssistant} />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route path={ROUTES.catalog} element={<CatalogPage />} />
      <Route path={ROUTES.aiDetection} element={<AIDetectionPage />} />
      <Route path={ROUTES.marketIntelligence} element={<MarketIntelligencePage />} />
      <Route path={ROUTES.cropPlanner} element={<CropPlannerPage />} />
      <Route path={ROUTES.procurement} element={<ProcurementPage />} />
      <Route path={ROUTES.checkout} element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path={ROUTES.orders} element={<RequireAuth><OrdersPage /></RequireAuth>} />
      <Route path={ROUTES.orderDetails} element={<RequireAuth><OrderDetailsPage /></RequireAuth>} />

      <Route path={ROUTES.farmerDashboard} element={<RequireAuth allowedRoles={['FARMER']}><RoleDashboard title="Farmer Dashboard" description="Your workspace for crop planning, mandi intelligence, produce procurement, and farm input shopping." links={[{ label: 'Shop agricultural inputs', href: ROUTES.catalog }, { label: 'Crop planner', href: ROUTES.cropPlanner }, { label: 'Mandi intelligence', href: ROUTES.marketIntelligence }, { label: 'Sell produce', href: ROUTES.procurement }]} /></RequireAuth>} />
      <Route path={ROUTES.buyerDashboard} element={<RequireAuth allowedRoles={['BUYER']}><RoleDashboard title="Buyer Dashboard" description="Manage produce sourcing, procurement opportunities, and agricultural supply orders." links={[{ label: 'Browse procurement', href: ROUTES.procurement }, { label: 'Market intelligence', href: ROUTES.marketIntelligence }, { label: 'Orders', href: ROUTES.orders }]} /></RequireAuth>} />
      <Route path={ROUTES.vendorDashboard} element={<RequireAuth allowedRoles={['SELLER']}><RoleDashboard title="Vendor Dashboard" description="Manage your agricultural product storefront and customer orders." links={[{ label: 'Product catalog', href: ROUTES.catalog }, { label: 'Orders', href: ROUTES.orders }]} /></RequireAuth>} />
      <Route path={ROUTES.expertDashboard} element={<RequireAuth allowedRoles={['EXPERT']}><RoleDashboard title="Expert Dashboard" description="Agricultural advisory workspace for approved expert accounts." links={[{ label: 'AI crop detection', href: ROUTES.aiDetection }, { label: 'Crop planner', href: ROUTES.cropPlanner }]} /></RequireAuth>} />
      <Route path={ROUTES.staffDashboard} element={<RequireAuth allowedRoles={['STAFF']}><RoleDashboard title="Staff Dashboard" description="Internal operations workspace." links={[{ label: 'Orders', href: ROUTES.orders }]} /></RequireAuth>} />
      <Route path={ROUTES.admin} element={<RequireAuth allowedRoles={['ADMIN']}><AdminDashboardPage /></RequireAuth>} />
      <Route path={ROUTES.unauthorized} element={<RequireAuth><Unauthorized /></RequireAuth>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

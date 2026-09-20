import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import HomePage from "../features/home/pages/HomePage";
import { ROUTES } from "../config/routes";
import NotFoundPage from "../pages/NotFoundPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export const AppRoutes = ({ onOpenAiAssistant }) => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage onOpenAiAssistant={onOpenAiAssistant} />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.catalog} element={<CatalogPage />} />
        <Route path={ROUTES.aiDetection} element={<AIDetectionPage />} />
        <Route path={ROUTES.marketIntelligence} element={<MarketIntelligencePage />} />
        <Route path={ROUTES.cropPlanner} element={<CropPlannerPage />} />
        <Route path={ROUTES.procurement} element={<ProcurementPage />} />
        <Route path={ROUTES.checkout} element={<CheckoutPage />} />
        <Route path={ROUTES.orders} element={<OrdersPage />} />
        <Route path={ROUTES.orderDetails} element={<OrderDetailsPage />} />
        <Route path={ROUTES.admin} element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};


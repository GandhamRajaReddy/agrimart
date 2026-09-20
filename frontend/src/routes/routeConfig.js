import {
  BarChart3,
  Leaf,
  ScanLine,
  ShoppingBasket,
  Sprout,
} from "lucide-react";

import { ROUTES } from "../config/routes";

export const primaryNavigation = [
  { label: "Shop inputs", to: ROUTES.catalog, icon: ShoppingBasket },
  { label: "Crop planner", to: ROUTES.cropPlanner, icon: Sprout },
  { label: "Mandi intelligence", to: ROUTES.marketIntelligence, icon: BarChart3 },
  { label: "Sell produce", to: ROUTES.procurement, icon: Leaf },
];

export const mobileQuickLinks = [
  ...primaryNavigation,
  { label: "Crop health scan", to: ROUTES.aiDetection, icon: ScanLine },
];

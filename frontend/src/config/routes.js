export const ROUTES = Object.freeze({
  home: '/',
  login: '/login',
  register: '/register',
  catalog: '/catalog',
  aiDetection: '/ai-detection',
  marketIntelligence: '/market-intelligence',
  cropPlanner: '/crop-planner',
  procurement: '/procurement',
  checkout: '/checkout',
  orders: '/orders',
  orderDetails: '/orders/:id',
  farmerDashboard: '/farmer/dashboard',
  buyerDashboard: '/buyer/dashboard',
  vendorDashboard: '/vendor/dashboard',
  expertDashboard: '/expert/dashboard',
  staffDashboard: '/staff/dashboard',
  admin: '/admin',
  unauthorized: '/unauthorized',
});

export const isRouteActive = (pathname, route) =>
  route === ROUTES.home ? pathname === route : pathname.startsWith(route);

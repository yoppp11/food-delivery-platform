import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { CartProvider } from '@/providers/cart-provider';
import { MerchantProvider } from '@/providers/merchant-provider';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { GuestRoute } from '@/components/guest-route';
import {
  HomePage,
  RestaurantsPage,
  RestaurantDetailPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
  ProfilePage,
  NotificationsPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  AboutPage,
} from '@/pages';
import { MerchantLayout } from '@/pages/merchant/layout';
import { MerchantDashboardPage } from '@/pages/merchant/index';
import { MerchantOrdersPage } from '@/pages/merchant/orders/index';
import { MerchantOrderDetailPage } from '@/pages/merchant/orders/[id]';
import { MerchantMenusPage } from '@/pages/merchant/menus/index';
import { NewMenuPage } from '@/pages/merchant/menus/new';
import { EditMenuPage } from '@/pages/merchant/menus/edit';
import { MerchantCategoriesPage } from '@/pages/merchant/categories/index';
import { MerchantSettingsPage } from '@/pages/merchant/settings/index';
import { MerchantReviewsPage } from '@/pages/merchant/reviews/index';
import { MerchantNotificationsPage } from '@/pages/merchant/notifications/index';
import { MerchantLoginPage } from '@/pages/merchant/auth/login';
import { MerchantRegisterPage } from '@/pages/merchant/auth/register';
import { MerchantSelectPage } from '@/pages/merchant/select';
import { DriverLoginPage } from '@/pages/driver/auth/login';
import { DriverLayout } from '@/pages/driver/layout';
import { DriverDashboardPage } from '@/pages/driver/index';
import { DriverOrdersPage } from '@/pages/driver/orders/index';
import { DriverHistoryPage } from '@/pages/driver/history/index';
import { DriverEarningsPage } from '@/pages/driver/earnings/index';
import { DriverReviewsPage } from '@/pages/driver/reviews/index';
import { DriverProfilePage } from '@/pages/driver/profile/index';
import { DriverNotificationsPage } from '@/pages/driver/notifications/index';
import { DriverRegisterPage } from '@/pages/driver/auth/register';
import { AdminLayout } from '@/pages/admin/layout';
import { AdminDashboardPage } from '@/pages/admin/index';
import { AdminUsersPage } from '@/pages/admin/users/index';
import { AdminUserDetailPage } from '@/pages/admin/users/[id]';
import { AdminMerchantsPage } from '@/pages/admin/merchants/index';
import { AdminMerchantDetailPage } from '@/pages/admin/merchants/[id]';
import { AdminDriversPage } from '@/pages/admin/drivers/index';
import { AdminOrdersPage } from '@/pages/admin/orders/index';
import { AdminOrderDetailPage } from '@/pages/admin/orders/[id]';
import { AdminPromotionsPage } from '@/pages/admin/promotions/index';
import { NewPromotionPage as AdminNewPromotionPage } from '@/pages/admin/promotions/new';
import { AdminCategoriesPage } from '@/pages/admin/categories/index';
import { AdminReportsPage } from '@/pages/admin/reports/index';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="food-delivery-theme">
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Pages with Layout */}
                <Route element={<Layout />}>
                  <Route path="/about" element={<AboutPage />} />
                </Route>

                {/* Auth Pages (no layout) - only for guests */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/merchant/login" element={<MerchantLoginPage />} />
                  <Route path="/driver/login" element={<DriverLoginPage />} />
                </Route>

                {/* Main Pages with Layout - CUSTOMER role only */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} redirectTo="/login" />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>
                </Route>

                {/* Merchant Registration - Customer role can register */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/merchant/register" element={<MerchantRegisterPage />} />
                </Route>

                {/* Merchant Pages - Merchant role only */}
                <Route element={<ProtectedRoute allowedRoles={['MERCHANT', 'ADMIN']} />}>
                  <Route
                    path="/merchant/*"
                    element={
                      <MerchantProvider>
                        <Routes>
                          <Route path="select" element={<MerchantSelectPage />} />
                          <Route element={<MerchantLayout />}>
                            <Route index element={<MerchantDashboardPage />} />
                            <Route path="orders" element={<MerchantOrdersPage />} />
                            <Route path="orders/:id" element={<MerchantOrderDetailPage />} />
                            <Route path="menus" element={<MerchantMenusPage />} />
                            <Route path="menus/new" element={<NewMenuPage />} />
                            <Route path="menus/:id/edit" element={<EditMenuPage />} />
                            <Route path="categories" element={<MerchantCategoriesPage />} />
                            <Route path="settings" element={<MerchantSettingsPage />} />
                            <Route path="reviews" element={<MerchantReviewsPage />} />
                            <Route path="notifications" element={<MerchantNotificationsPage />} />
                          </Route>
                        </Routes>
                      </MerchantProvider>
                    }
                  />
                </Route>

                {/* Driver Registration - Customer role can register */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/driver/register" element={<DriverRegisterPage />} />
                </Route>

                {/* Driver Pages - Driver role only */}
                <Route element={<ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']} />}>
                  <Route
                    path="/driver/*"
                    element={
                      <Routes>
                        <Route element={<DriverLayout />}>
                          <Route index element={<DriverDashboardPage />} />
                          <Route path="orders" element={<DriverOrdersPage />} />
                          <Route path="history" element={<DriverHistoryPage />} />
                          <Route path="earnings" element={<DriverEarningsPage />} />
                          <Route path="reviews" element={<DriverReviewsPage />} />
                          <Route path="profile" element={<DriverProfilePage />} />
                          <Route path="notifications" element={<DriverNotificationsPage />} />
                        </Route>
                      </Routes>
                    }
                  />
                </Route>

                {/* Admin Pages - Admin role only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route
                    path="/admin/*"
                    element={
                      <Routes>
                        <Route element={<AdminLayout />}>
                          <Route index element={<AdminDashboardPage />} />
                          <Route path="users" element={<AdminUsersPage />} />
                          <Route path="users/:id" element={<AdminUserDetailPage />} />
                          <Route path="merchants" element={<AdminMerchantsPage />} />
                          <Route path="merchants/:id" element={<AdminMerchantDetailPage />} />
                          <Route path="drivers" element={<AdminDriversPage />} />
                          <Route path="orders" element={<AdminOrdersPage />} />
                          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                          <Route path="promotions" element={<AdminPromotionsPage />} />
                          <Route path="promotions/new" element={<AdminNewPromotionPage />} />
                          <Route path="categories" element={<AdminCategoriesPage />} />
                          <Route path="reports" element={<AdminReportsPage />} />
                        </Route>
                      </Routes>
                    }
                  />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Simple 404 Page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <span className="text-8xl mb-4">🍕</span>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <a
        href="/"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default App;

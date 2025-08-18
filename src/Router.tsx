import { createBrowserRouter } from 'react-router'
import App from './App'

// Layouts
import { MainLayout } from './layouts/MainLayout'
import { HomeLayout } from './layouts/HomeLayout'
import AuthLayout from './layouts/AuthLayout'
import AccountLayout from './layouts/AccountLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Páginas públicas
import ProductsPage from './pages/products'
import ProductDetail from './pages/products/Detail'
import CheckOutPage from './pages/checkout'
import UserOrdersPage from './pages/orders'

// Páginas auth
import LoginPage from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPasswordPage from './pages/auth/ForgotPassword'
import ResetPasswordValidatePage from './pages/auth/ResetPasswordValidate'
import ResetPasswordConfirmPage from './pages/auth/ResetPasswordConfirm'

// Páginas de cuenta
import Profile from './pages/account/user/Profile'
import ChangePassword from './pages/account/user/ChangePassword'

// Páginas dashboard
import DashboardIndex from './pages/dashboard'
import UsersDashboardPage from './pages/dashboard/users'
import CategoriesDashboardPage from './pages/dashboard/categories'
import UnitiesDashboardPage from './pages/dashboard/unities'
import ProductsDashboardPage from './pages/dashboard/products'
import CouponsDashboardPage from './pages/dashboard/coupons'
import OrdersPage from './pages/dashboard/orders'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Main envuelve todo
    errorElement: <div>404</div>,
    children: [
      // 🌐 Rutas públicas (home)
      {
        element: <HomeLayout />,
        children: [
          { index: true, element: <App /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/:slug', element: <ProductDetail /> },
          { path: 'checkout', element: <CheckOutPage /> },
          { path: 'orders', element: <UserOrdersPage /> },
          { path: 'contacts', element: <div>Contacts</div> },
          { path: 'privacy-policy', element: <div>Privacy Policy</div> },
          { path: 'terms-and-conditions', element: <div>Terms and Conditions</div> },
        ],
      },

      // 🔐 Rutas de autenticación
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password-validate', element: <ResetPasswordValidatePage /> },
          { path: 'reset-password-confirm/:code', element: <ResetPasswordConfirmPage /> },
        ],
      },

      // 👤 Rutas de cuenta del usuario
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'change-password', element: <ChangePassword /> },
        ],
      },

      // 📊 Rutas del dashboard
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardIndex /> },
          { path: 'users', element: <UsersDashboardPage /> },
          { path: 'categories', element: <CategoriesDashboardPage /> },
          { path: 'unities', element: <UnitiesDashboardPage /> },
          { path: 'products', element: <ProductsDashboardPage /> },
          { path: 'coupons', element: <CouponsDashboardPage /> },
          { path: 'orders', element: <OrdersPage /> },
        ],
      },
    ],
  },
])

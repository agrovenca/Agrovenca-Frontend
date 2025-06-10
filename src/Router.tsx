import { createBrowserRouter } from 'react-router'
import { MainLayout } from './layouts/MainLayout'
import App from './App'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/account/user/Profile'
import AccountLayout from './layouts/AccountLayout'
import ChangePassword from './pages/account/user/ChangePassword'
import DashboardLayout from './layouts/DashboardLayout'
import CategoriesDashboardPage from './pages/dashboard/categories'
import UnitiesDashboardPage from './pages/dashboard/unities'
import UsersDashboardPage from './pages/dashboard/users'
import ForgotPasswordPage from './pages/auth/ForgotPassword'
import CouponsDashboardPage from './pages/dashboard/coupons'
import ProductsDashboardPage from './pages/dashboard/products'
import ResetPasswordValidatePage from './pages/auth/ResetPasswordValidate'
import ResetPasswordConfirmPage from './pages/auth/ResetPasswordConfirm'
import ProductsPage from './pages/products'
import ProductDetail from './pages/products/Detail'
import CheckOutPage from './pages/checkout'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404</div>,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/products/:productId',
        element: <ProductDetail />,
      },
      {
        path: '/contacts',
        element: <div>Contacts</div>,
      },
      {
        path: '/checkout',
        element: <CheckOutPage />,
      },
      {
        path: '/privacy-policy',
        element: <div>Privacy Policy</div>,
      },
      {
        path: '/terms-and-conditions',
        element: <div>Terms and Conditions</div>,
      },
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: 'reset-password-validate',
            element: <ResetPasswordValidatePage />,
          },
          {
            path: 'reset-password-confirm/:code',
            element: <ResetPasswordConfirmPage />,
          },
        ],
      },
      {
        path: '/account',
        element: <AccountLayout />,
        children: [
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'change-password',
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'users',
            element: <UsersDashboardPage />,
          },
          {
            path: 'categories',
            element: <CategoriesDashboardPage />,
          },
          {
            path: 'unities',
            element: <UnitiesDashboardPage />,
          },
          {
            path: 'products',
            element: <ProductsDashboardPage />,
          },
          {
            path: 'coupons',
            element: <CouponsDashboardPage />,
          },
        ],
      },
    ],
  },
])

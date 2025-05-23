import { createBrowserRouter } from 'react-router'
import { MainLayout } from './layouts/MainLayout'
import App from './App'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/account/user/Profile'
import AccountLayout from './layouts/AccountLayout'
import ChangePassword from './pages/account/user/ChangePassword'
import SettingsLayout from './layouts/SettingsLayout'
import CategoriesSettingsPage from './pages/settings/categories'
import UnitiesSettingsPage from './pages/settings/unities'
import UsersSettingsPage from './pages/settings/users'
import ForgotPasswordPage from './pages/auth/ForgotPassword'
import CouponsSettingsPage from './pages/settings/coupons'
import ProductsSettingsPage from './pages/settings/products'
import ResetPasswordValidatePage from './pages/auth/ResetPasswordValidate'
import ResetPasswordConfirmPage from './pages/auth/ResetPasswordConfirm'

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
        element: <div>Products</div>,
      },
      {
        path: '/contacts',
        element: <div>Contacts</div>,
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
        path: '/settings',
        element: <SettingsLayout />,
        children: [
          {
            path: 'users',
            element: <UsersSettingsPage />,
          },
          {
            path: 'categories',
            element: <CategoriesSettingsPage />,
          },
          {
            path: 'unities',
            element: <UnitiesSettingsPage />,
          },
          {
            path: 'products',
            element: <ProductsSettingsPage />,
          },
          {
            path: 'coupons',
            element: <CouponsSettingsPage />,
          },
        ],
      },
    ],
  },
])

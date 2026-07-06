import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { routeConfig } from './routeConfig';
import useAuth from '@/hooks/useAuth';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages — app
import Dashboard from '@/pages/Dashboard/Dashboard';
import Tasks from '@/pages/Tasks/Tasks';
import EmployeeDirectory from '@/pages/EmployeeDirectory/EmployeeDirectory';

// Pages — auth
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-950">
        <p className="text-sm text-neutral-500">Checking authentication…</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

const PublicRoute: React.FC = () => {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-950">
        <p className="text-sm text-neutral-500">Checking session…</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const components = {
  Dashboard,
  Tasks,
  EmployeeDirectory
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public auth pages and root redirect */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {routeConfig.map((route, index) => {
            const PageComponent = components[route.componentName];
            return <Route key={index} path={route.path} element={<PageComponent />} />;
          })}
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

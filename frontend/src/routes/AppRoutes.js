import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { isLoggedIn } from '../utils/auth';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import DashboardLayout from '../layout/DashboardLayout';
import Vaccines from '../pages/Vaccines';
import Students from '../pages/Student';
import VaccinationDrives from '../pages/VaccinationDrives';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <DashboardLayout><Users /></DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vaccines"
        element={
          <PrivateRoute>
            <DashboardLayout><Vaccines /></DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <DashboardLayout><Students /></DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vaccination-drives"
        element={
          <PrivateRoute>
            <DashboardLayout><VaccinationDrives /></DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

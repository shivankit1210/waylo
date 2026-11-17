import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { TripsPage } from '@/features/trips/TripsPage';
import { CreateTripPage } from '@/features/trips/CreateTripPage';
import { EditTripPage } from '@/features/trips/EditTripPage';
import { TripDetailPage } from '@/features/trips/TripDetailPage';
import { AITripPlannerPage } from '@/features/ai/AITripPlannerPage';
import { NotFoundPage } from '@/features/common/NotFoundPage';
import { useAuthStore } from '@/stores/authStore';

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <LoginPage />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <RegisterPage />
            </PublicAuthRoute>
          }
        />

        {/* Protected Application Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/trips"
          element={
            <AuthGuard>
              <TripsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/trips/new"
          element={
            <AuthGuard>
              <CreateTripPage />
            </AuthGuard>
          }
        />
        <Route
          path="/plan-ai"
          element={
            <AuthGuard>
              <AITripPlannerPage />
            </AuthGuard>
          }
        />
        <Route
          path="/trips/ai-plan"
          element={
            <AuthGuard>
              <AITripPlannerPage />
            </AuthGuard>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <AuthGuard>
              <TripDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/trips/:tripId/edit"
          element={
            <AuthGuard>
              <EditTripPage />
            </AuthGuard>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
function PublicAuthRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
export function AppRoutes() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppShell, {}), children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(PublicAuthRoute, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/register", element: _jsx(PublicAuthRoute, { children: _jsx(RegisterPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(AuthGuard, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/trips", element: _jsx(AuthGuard, { children: _jsx(TripsPage, {}) }) }), _jsx(Route, { path: "/trips/new", element: _jsx(AuthGuard, { children: _jsx(CreateTripPage, {}) }) }), _jsx(Route, { path: "/plan-ai", element: _jsx(AuthGuard, { children: _jsx(AITripPlannerPage, {}) }) }), _jsx(Route, { path: "/trips/ai-plan", element: _jsx(AuthGuard, { children: _jsx(AITripPlannerPage, {}) }) }), _jsx(Route, { path: "/trips/:tripId", element: _jsx(AuthGuard, { children: _jsx(TripDetailPage, {}) }) }), _jsx(Route, { path: "/trips/:tripId/edit", element: _jsx(AuthGuard, { children: _jsx(EditTripPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }));
}
//# sourceMappingURL=index.js.map
import { Outlet, useLocation } from 'react-router-dom';
import { Compass, X, LayoutDashboard, Sparkles, Settings } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { InstallPWABanner } from '@/components/common/InstallPWABanner';

export function AppShell() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const location = useLocation();

  // If on landing or auth pages, don't show full dashboard shell
  const isAuthOrLanding = ['/', '/login', '/register'].includes(location.pathname);

  if (isAuthOrLanding) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <OfflineBanner />
        <main className="flex-1">
          <Outlet />
        </main>
        <InstallPWABanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <OfflineBanner />

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in-0 duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-background border-r border-border p-6 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-6 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">Waylo</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-foreground hover:bg-muted"
              >
                <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/trips"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-foreground hover:bg-muted"
              >
                <Compass className="h-5 w-5 text-muted-foreground" />
                <span>My Trips</span>
              </Link>
              <Link
                to="/trips/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-primary hover:bg-primary/10"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Plan with AI</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main app body */}
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={cn(
            'flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full'
          )}
        >
          <Outlet />
        </main>
      </div>

      <InstallPWABanner />
      <BottomNav />
    </div>
  );
}

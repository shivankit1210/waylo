import { Link, useNavigate } from 'react-router-dom';
import { Compass, Menu, Moon, Sun, User, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, toggleTheme, toggleMobileMenu } = useUIStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'W';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Waylo
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground -mt-1 hidden sm:inline">
                Trip OS
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50">
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors hover:bg-background/80"
          >
            Dashboard
          </Link>
          <Link
            to="/trips"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors hover:bg-background/80"
          >
            My Trips
          </Link>
          <Link
            to="/plan-ai"
            className="px-3.5 py-1.5 text-sm font-medium text-primary hover:text-primary/90 flex items-center gap-1.5 rounded-lg transition-colors hover:bg-primary/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Plan with AI</span>
          </Link>
        </nav>

        {/* Right: Theme toggle & User Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0.5 outline-none">
                  <Avatar className="h-9 w-9">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="gap-2">
                  <Compass className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/trips')} className="gap-2">
                  <User className="h-4 w-4" />
                  <span>My Trips</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/trips/new')} className="gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Plan with AI</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="gap-2">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  CalendarDays,
  CarFront,
  Luggage,
  Receipt,
  FileText,
  Users,
  Radio,
  Globe,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAI?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', href: '/trips', icon: Compass },
  { name: 'Plan with AI', href: '/trips/new', icon: Sparkles, isAI: true, badge: 'AI' },
  { name: 'Itinerary', href: '/trips?tab=itinerary', icon: CalendarDays },
  { name: 'Vehicle & Route', href: '/trips?tab=vehicle', icon: CarFront },
  { name: 'Packing Manager', href: '/trips?tab=packing', icon: Luggage },
  { name: 'Expense Split', href: '/trips?tab=expenses', icon: Receipt },
  { name: 'Bookings & Docs', href: '/trips?tab=bookings', icon: FileText },
  { name: 'Group & Roles', href: '/trips?tab=members', icon: Users },
  { name: 'Live Trip', href: '/trips?tab=live', icon: Radio, badge: 'Live' },
  { name: 'Explore & Social', href: '/trips?tab=explore', icon: Globe },
  { name: 'Memories', href: '/trips?tab=memories', icon: ImageIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border/70 bg-card/60 backdrop-blur-md transition-all duration-300 relative z-30 select-none min-h-[calc(100vh-4rem)]',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-40"
        aria-label="Toggle sidebar collapse"
      >
        {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>

      {/* Nav list */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={150}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href.split('?')[0]) && item.href !== '/trips/new');

            const content = (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary-foreground' : item.isAI ? 'text-blue-500' : 'text-muted-foreground'
                  )}
                />

                {sidebarOpen && (
                  <span className="truncate flex-1 font-medium">{item.name}</span>
                )}

                {sidebarOpen && item.badge && (
                  <span
                    className={cn(
                      'ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md',
                      item.badge === 'Live'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-primary/20 text-primary dark:text-primary-foreground'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );

            if (!sidebarOpen) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return content;
          })}
        </TooltipProvider>
      </div>

      {/* Footer promotion / quick button */}
      {sidebarOpen ? (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-semibold text-foreground">AI Trip Generator</h4>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            Create optimized itineraries, routes & gear recommendations in seconds.
          </p>
          <Button size="sm" variant="gradient" className="w-full text-xs h-8" asChild>
            <NavLink to="/trips/new">Start Planning</NavLink>
          </Button>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="gradient" className="rounded-xl h-10 w-10" asChild>
                  <NavLink to="/trips/new">
                    <Sparkles className="h-4 w-4" />
                  </NavLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Quick AI Plan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </aside>
  );
}

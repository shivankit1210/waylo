import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, CalendarDays, CarFront, Luggage, Receipt, FileText, Users, Radio, Globe, Image as ImageIcon, Settings, ChevronLeft, ChevronRight, } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const navItems = [
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
    return (_jsxs("aside", { className: cn('hidden lg:flex flex-col border-r border-border/70 bg-card/60 backdrop-blur-md transition-all duration-300 relative z-30 select-none min-h-[calc(100vh-4rem)]', sidebarOpen ? 'w-64' : 'w-20'), children: [_jsx("button", { onClick: toggleSidebar, className: "absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-40", "aria-label": "Toggle sidebar collapse", children: sidebarOpen ? _jsx(ChevronLeft, { className: "h-3.5 w-3.5" }) : _jsx(ChevronRight, { className: "h-3.5 w-3.5" }) }), _jsx("div", { className: "flex-1 py-4 px-3 space-y-1 overflow-y-auto", children: _jsx(TooltipProvider, { delayDuration: 150, children: navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href ||
                            (item.href !== '/dashboard' && location.pathname.startsWith(item.href.split('?')[0]) && item.href !== '/trips/new');
                        const content = (_jsxs(NavLink, { to: item.href, className: cn('flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative', isActive
                                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'), children: [_jsx(Icon, { className: cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-primary-foreground' : item.isAI ? 'text-blue-500' : 'text-muted-foreground') }), sidebarOpen && (_jsx("span", { className: "truncate flex-1 font-medium", children: item.name })), sidebarOpen && item.badge && (_jsx("span", { className: cn('ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md', item.badge === 'Live'
                                        ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                                        : 'bg-primary/20 text-primary dark:text-primary-foreground'), children: item.badge }))] }, item.name));
                        if (!sidebarOpen) {
                            return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: content }), _jsx(TooltipContent, { side: "right", className: "font-medium", children: item.name })] }, item.name));
                        }
                        return content;
                    }) }) }), sidebarOpen ? (_jsxs("div", { className: "p-4 m-3 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/10 border border-blue-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [_jsx(Sparkles, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }), _jsx("h4", { className: "text-xs font-semibold text-foreground", children: "AI Trip Generator" })] }), _jsx("p", { className: "text-[11px] text-muted-foreground mb-3 leading-relaxed", children: "Create optimized itineraries, routes & gear recommendations in seconds." }), _jsx(Button, { size: "sm", variant: "gradient", className: "w-full text-xs h-8", asChild: true, children: _jsx(NavLink, { to: "/trips/new", children: "Start Planning" }) })] })) : (_jsx("div", { className: "p-3 flex justify-center", children: _jsx(TooltipProvider, { delayDuration: 150, children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { size: "icon", variant: "gradient", className: "rounded-xl h-10 w-10", asChild: true, children: _jsx(NavLink, { to: "/trips/new", children: _jsx(Sparkles, { className: "h-4 w-4" }) }) }) }), _jsx(TooltipContent, { side: "right", children: "Quick AI Plan" })] }) }) }))] }));
}
//# sourceMappingURL=Sidebar.js.map
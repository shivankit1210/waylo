import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
export function BottomNav() {
    const location = useLocation();
    const items = [
        { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Trips', href: '/trips', icon: Compass },
        { name: 'Plan AI', href: '/trips/new', icon: Sparkles, isCenter: true },
        { name: 'Explore', href: '/trips?tab=explore', icon: Globe },
        { name: 'Profile', href: '/dashboard#profile', icon: User },
    ];
    return (_jsx("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/70 pb-[env(safe-area-inset-bottom)] shadow-lg shadow-black/5", children: _jsx("div", { className: "flex items-center justify-around h-16 px-2", children: items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(item.href);
                if (item.isCenter) {
                    return (_jsxs(NavLink, { to: item.href, className: "relative -top-5 flex flex-col items-center group", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 group-active:scale-95 transition-transform", children: _jsx(Icon, { className: "h-6 w-6" }) }), _jsx("span", { className: "text-[11px] font-semibold text-primary mt-1", children: "Plan AI" })] }, item.name));
                }
                return (_jsxs(NavLink, { to: item.href, className: cn('flex flex-col items-center justify-center flex-1 py-1 transition-all group', isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'), children: [_jsx("div", { className: cn('p-1 rounded-xl transition-all', isActive && 'bg-primary/10'), children: _jsx(Icon, { className: cn('h-5 w-5 transition-transform group-hover:scale-110') }) }), _jsx("span", { className: "text-[10px] font-medium tracking-tight mt-0.5", children: item.name })] }, item.name));
            }) }) }));
}
//# sourceMappingURL=BottomNav.js.map
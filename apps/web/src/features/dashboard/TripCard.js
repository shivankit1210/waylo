import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Bike, Car, Plane, Train, Bus, Footprints, Ship, Users, } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateRange, formatCurrency } from '@/lib/utils';
const getTransportIcon = (mode) => {
    switch (mode) {
        case 'MOTORCYCLE':
            return _jsx("span", { children: _jsx(Bike, { className: "h-3.5 w-3.5 text-blue-500" }) }, mode);
        case 'CAR':
            return _jsx("span", { children: _jsx(Car, { className: "h-3.5 w-3.5 text-emerald-500" }) }, mode);
        case 'FLIGHT':
            return _jsx("span", { children: _jsx(Plane, { className: "h-3.5 w-3.5 text-sky-500" }) }, mode);
        case 'TRAIN':
            return _jsx("span", { children: _jsx(Train, { className: "h-3.5 w-3.5 text-purple-500" }) }, mode);
        case 'BUS':
            return _jsx("span", { children: _jsx(Bus, { className: "h-3.5 w-3.5 text-amber-500" }) }, mode);
        case 'WALKING':
            return _jsx("span", { children: _jsx(Footprints, { className: "h-3.5 w-3.5 text-teal-500" }) }, mode);
        case 'FERRY':
            return _jsx("span", { children: _jsx(Ship, { className: "h-3.5 w-3.5 text-cyan-500" }) }, mode);
        default:
            return null;
    }
};
export function TripCard({ trip }) {
    const members = trip.members || [];
    return (_jsx(Link, { to: `/trips/${trip.id}`, className: "block group h-full", children: _jsxs(Card, { className: "overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col rounded-2xl", children: [_jsxs("div", { className: "relative h-44 w-full overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-900", children: [trip.coverImageUrl ? (_jsx("img", { src: trip.coverImageUrl, alt: trip.name, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" })) : (_jsx("div", { className: "h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center", children: _jsx("span", { className: "text-white/40 text-4xl font-black", children: "Waylo" }) })), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }), _jsxs("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between", children: [_jsx(StatusBadge, { status: trip.status }), trip.estimatedBudget ? (_jsx("span", { className: "bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10", children: formatCurrency(trip.estimatedBudget, trip.currency) })) : null] }), trip.destination && (_jsxs("div", { className: "absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 max-w-[90%] truncate", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-primary shrink-0" }), _jsx("span", { className: "truncate", children: trip.destination })] }))] }), _jsxs("div", { className: "p-5 flex-1 flex flex-col justify-between space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors", children: trip.name }), trip.description && (_jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed", children: trip.description }))] }), _jsxs("div", { className: "space-y-3 pt-2 border-t border-border/60", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }), _jsx("span", { children: formatDateRange(trip.startDate, trip.endDate) })] }), trip.transportModes && trip.transportModes.length > 0 && (_jsx("div", { className: "flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-lg", children: trip.transportModes.map(getTransportIcon) }))] }), _jsxs("div", { className: "flex items-center justify-between pt-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "flex -space-x-2 overflow-hidden", children: members.slice(0, 3).map((m) => (_jsxs(Avatar, { className: "h-6 w-6 ring-2 ring-card border-none", children: [m.user.avatarUrl && _jsx(AvatarImage, { src: m.user.avatarUrl, alt: m.user.displayName }), _jsx(AvatarFallback, { className: "text-[9px]", children: m.user.displayName.slice(0, 2).toUpperCase() })] }, m.id))) }), members.length > 3 && (_jsxs("span", { className: "text-[10px] font-medium text-muted-foreground", children: ["+", members.length - 3] })), members.length === 0 && (_jsxs("span", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [_jsx(Users, { className: "h-3 w-3" }), " Solo"] }))] }), trip.tags && trip.tags.length > 0 && (_jsxs("span", { className: "text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md truncate max-w-[100px]", children: ["#", trip.tags[0]] }))] })] })] })] }) }));
}
//# sourceMappingURL=TripCard.js.map
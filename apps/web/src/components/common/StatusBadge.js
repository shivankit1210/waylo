import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TripStatus } from '@waylo/shared';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
export function StatusBadge({ status, className }) {
    switch (status) {
        case TripStatus.ONGOING:
            return (_jsxs(Badge, { variant: "success", className: cn('gap-1.5 font-semibold uppercase tracking-wider text-[11px]', className), children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" }), "Ongoing"] }));
        case TripStatus.PLANNED:
            return (_jsx(Badge, { variant: "info", className: cn('font-semibold uppercase tracking-wider text-[11px]', className), children: "Planned" }));
        case TripStatus.DRAFT:
            return (_jsx(Badge, { variant: "outline", className: cn('font-semibold uppercase tracking-wider text-[11px] text-muted-foreground border-dashed', className), children: "Draft" }));
        case TripStatus.COMPLETED:
            return (_jsx(Badge, { variant: "secondary", className: cn('font-semibold uppercase tracking-wider text-[11px] bg-slate-500/15 text-slate-600 dark:text-slate-300', className), children: "Completed" }));
        case TripStatus.CANCELLED:
            return (_jsx(Badge, { variant: "destructive", className: cn('font-semibold uppercase tracking-wider text-[11px]', className), children: "Cancelled" }));
        case TripStatus.ARCHIVED:
            return (_jsx(Badge, { variant: "outline", className: cn('font-semibold uppercase tracking-wider text-[11px] text-muted-foreground', className), children: "Archived" }));
        default:
            return _jsx(Badge, { className: className, children: status });
    }
}
//# sourceMappingURL=StatusBadge.js.map
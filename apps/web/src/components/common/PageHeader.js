import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function PageHeader({ title, description, children, className, badge, }) {
    return (_jsxs("div", { className: cn('flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/60 mb-6', className), children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground", children: title }), badge] }), description && (_jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl", children: description }))] }), children && (_jsx("div", { className: "flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0", children: children }))] }));
}
//# sourceMappingURL=PageHeader.js.map
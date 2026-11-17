import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className, children, }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-border/80 bg-card/40 backdrop-blur-sm transition-all', className), children: [_jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner ring-8 ring-primary/5", children: _jsx(Icon, { className: "h-8 w-8" }) }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-1.5", children: title }), _jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed", children: description }), actionLabel && onAction && (_jsx(Button, { onClick: onAction, className: "rounded-xl px-6", children: actionLabel })), children] }));
}
//# sourceMappingURL=EmptyState.js.map
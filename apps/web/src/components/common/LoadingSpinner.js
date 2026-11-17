import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
};
export function LoadingSpinner({ className, size = 'md', text, }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center p-6 space-y-3', className), children: [_jsx(Loader2, { className: cn('animate-spin text-primary', sizeMap[size]) }), text && _jsx("p", { className: "text-sm text-muted-foreground animate-pulse font-medium", children: text })] }));
}
//# sourceMappingURL=LoadingSpinner.js.map
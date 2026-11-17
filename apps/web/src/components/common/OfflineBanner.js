import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { WifiOff, RefreshCw, CloudUpload, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOfflineSync } from '@/lib/offline/useOfflineSync';
export function OfflineBanner() {
    const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();
    const [isDismissed, setIsDismissed] = useState(false);
    // If online and no pending items to sync, hide banner
    if (isOnline && pendingCount === 0) {
        return null;
    }
    if (isDismissed && isOnline) {
        return null;
    }
    return (_jsx("div", { className: `w-full transition-all duration-300 z-50 ${!isOnline
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white'
            : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white'} py-2.5 px-4 shadow-md text-xs`, children: _jsxs("div", { className: "max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "h-7 w-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0", children: !isOnline ? (_jsx(WifiOff, { className: "h-4 w-4 animate-pulse text-white" })) : (_jsx(CloudUpload, { className: "h-4 w-4 text-white" })) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-extrabold uppercase tracking-wider text-[11px]", children: !isOnline ? 'Offline Mountain Mode' : 'Online Sync Available' }), pendingCount > 0 && (_jsxs("span", { className: "px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black", children: [pendingCount, " Pending Change", pendingCount > 1 ? 's' : ''] }))] }), _jsx("p", { className: "text-[11px] text-white/90 leading-tight", children: !isOnline
                                        ? 'Your offline itinerary, packing lists, and cached map tiles are active. Changes will auto-sync when back in cellular coverage.'
                                        : 'Connection restored. Offline actions are ready to save to Waylo cloud.' })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0 self-end sm:self-auto", children: [pendingCount > 0 && (_jsxs(Button, { size: "sm", variant: "secondary", onClick: syncNow, disabled: !isOnline || isSyncing, className: "rounded-xl font-bold text-xs gap-1.5 h-8 bg-white text-slate-900 hover:bg-slate-100 shadow-sm", children: [_jsx(RefreshCw, { className: `h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}` }), _jsx("span", { children: isSyncing ? 'Syncing...' : 'Sync Now' })] })), !isOnline && (_jsx("span", { className: "text-[10px] text-white/80 font-medium hidden md:inline", children: "IndexedDB Storage Active" }))] })] }) }));
}
//# sourceMappingURL=OfflineBanner.js.map
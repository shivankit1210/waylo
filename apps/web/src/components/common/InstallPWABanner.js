import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function InstallPWABanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isDismissed, setIsDismissed] = useState(false);
    useEffect(() => {
        // Check if dismissed previously this session
        const dismissed = sessionStorage.getItem('waylo_pwa_dismissed');
        if (dismissed === 'true') {
            setIsDismissed(true);
        }
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);
    const handleInstall = async () => {
        if (!deferredPrompt)
            return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            console.log('User installed Waylo PWA');
        }
        setDeferredPrompt(null);
    };
    const handleDismiss = () => {
        setIsDismissed(true);
        sessionStorage.setItem('waylo_pwa_dismissed', 'true');
    };
    // Only show if prompt is available and not dismissed
    if (!deferredPrompt || isDismissed) {
        return null;
    }
    return (_jsxs("div", { className: "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: "/icon-192.svg", alt: "Waylo App", className: "h-12 w-12 rounded-2xl shadow-md border border-white/10 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-sm leading-tight text-white", children: "Install Waylo App" }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug mt-0.5", children: "Access itineraries, offline maps, and live GPS telemetry even with zero bars of signal." })] })] }), _jsx("button", { onClick: handleDismiss, className: "text-slate-400 hover:text-white transition-colors -mr-1 -mt-1 p-1", "aria-label": "Dismiss banner", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "flex items-center gap-2 mt-3 pt-3 border-t border-white/10", children: _jsxs(Button, { size: "sm", onClick: handleInstall, className: "w-full rounded-xl font-bold text-xs gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white h-9 shadow-md", children: [_jsx(Download, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Add to Home Screen" })] }) })] }));
}
//# sourceMappingURL=InstallPWABanner.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { JournalTimeline } from './JournalTimeline';
import { HighlightsGallery } from './HighlightsGallery';
import { TripAnalyticsReport } from './TripAnalyticsReport';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
export function JournalAndAnalyticsView({ trip }) {
    const [activeSubTab, setActiveSubTab] = useState('journal');
    return (_jsx("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: _jsxs(Tabs, { value: activeSubTab, onValueChange: setActiveSubTab, className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between border-b border-border/80 pb-4", children: _jsxs(TabsList, { className: "bg-muted/60 p-1 rounded-2xl", children: [_jsxs(TabsTrigger, { value: "journal", className: "gap-2 rounded-xl text-xs sm:text-sm font-semibold", children: [_jsx(BookOpen, { className: "h-4 w-4" }), _jsx("span", { children: "Daily Journal" })] }), _jsxs(TabsTrigger, { value: "highlights", className: "gap-2 rounded-xl text-xs sm:text-sm font-semibold", children: [_jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }), _jsx("span", { children: "Highlights & Gallery" })] }), _jsxs(TabsTrigger, { value: "analytics", className: "gap-2 rounded-xl text-xs sm:text-sm font-semibold", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-indigo-500" }), _jsx("span", { children: "Trip Analytics & Report" })] })] }) }), _jsx(TabsContent, { value: "journal", className: "space-y-6 focus:outline-none", children: _jsx(JournalTimeline, { trip: trip }) }), _jsx(TabsContent, { value: "highlights", className: "space-y-6 focus:outline-none", children: _jsx(HighlightsGallery, { trip: trip }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6 focus:outline-none", children: _jsx(TripAnalyticsReport, { trip: trip }) })] }) }));
}
//# sourceMappingURL=JournalAndAnalyticsView.js.map
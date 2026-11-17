import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from './hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookOpen, Plus, Trash2, Calendar, CloudSun, MapPin, } from 'lucide-react';
const MOOD_EMOJIS = {
    EXCELLENT: { emoji: '🤩', label: 'Stoked', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    ADVENTUROUS: { emoji: '🔥', label: 'Adventurous', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    PEACEFUL: { emoji: '🧘', label: 'Peaceful', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    TIRED: { emoji: '🥱', label: 'Exhausted', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    CHALLENGING: { emoji: '🧗', label: 'Grueling', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};
export function JournalTimeline({ trip }) {
    const { data: entries = [], isLoading } = useJournalEntries(trip.id);
    const createEntryMutation = useCreateJournalEntry(trip.id);
    const deleteEntryMutation = useDeleteJournalEntry(trip.id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dayNumber, setDayNumber] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');
    const [mood, setMood] = useState('ADVENTUROUS');
    const [weatherNote, setWeatherNote] = useState('');
    const [mediaUrlInput, setMediaUrlInput] = useState('');
    const handleCreate = async () => {
        if (!title.trim() || !content.trim())
            return;
        const mediaUrls = mediaUrlInput
            .split('\n')
            .map((u) => u.trim())
            .filter((u) => u.length > 0);
        await createEntryMutation.mutateAsync({
            title: title.trim(),
            content: content.trim(),
            dayNumber: dayNumber ? Number(dayNumber) : null,
            location: location.trim() || null,
            mood,
            weatherNote: weatherNote.trim() || null,
            mediaUrls,
        });
        setIsDialogOpen(false);
        setTitle('');
        setContent('');
        setDayNumber('');
        setLocation('');
        setWeatherNote('');
        setMediaUrlInput('');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-5 w-5 text-primary" }), "Expedition Daily Log & Reflections"] }), _jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Chronicle your daily stories, rider reflections, mountain encounters, and photo logs." })] }), _jsxs(Button, { onClick: () => setIsDialogOpen(true), className: "gap-2 rounded-xl", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "New Journal Entry" })] })] }), isLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2].map((i) => (_jsx("div", { className: "h-48 rounded-3xl bg-muted/40 animate-pulse" }, i))) })) : entries.length === 0 ? (_jsxs(Card, { className: "p-8 text-center rounded-3xl border-dashed border-2 border-border/80", children: [_jsx("div", { className: "mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3", children: _jsx(BookOpen, { className: "h-6 w-6" }) }), _jsx("h4", { className: "font-bold text-foreground mb-1", children: "Your journal is waiting for its first story" }), _jsx("p", { className: "text-xs text-muted-foreground max-w-md mx-auto mb-4", children: "Record what happened today, roadside fixes, encounters with locals, or personal reflections along the route." }), _jsxs(Button, { onClick: () => setIsDialogOpen(true), variant: "outline", className: "gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Write Day 1 Log"] })] })) : (_jsx("div", { className: "relative pl-6 sm:pl-8 border-l-2 border-primary/20 space-y-8", children: entries.map((entry) => {
                    const moodInfo = entry.mood ? MOOD_EMOJIS[entry.mood] : null;
                    return (_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background shadow-md", children: _jsx("span", { className: "text-[10px] font-bold", children: entry.dayNumber ? `D${entry.dayNumber}` : '★' }) }), _jsxs(Card, { className: "p-6 rounded-3xl border-border/80 hover:shadow-md transition-all duration-200 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [entry.dayNumber && (_jsxs(Badge, { variant: "outline", className: "bg-primary/5 text-primary border-primary/20 font-bold", children: ["Day ", entry.dayNumber] })), _jsx("h4", { className: "text-lg font-bold text-foreground", children: entry.title })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1", children: [entry.location && (_jsxs("span", { className: "flex items-center gap-1 font-medium text-slate-300", children: [_jsx(MapPin, { className: "h-3 w-3 text-red-400" }), entry.location] })), entry.weatherNote && (_jsxs("span", { className: "flex items-center gap-1 font-medium text-amber-300", children: [_jsx(CloudSun, { className: "h-3 w-3" }), entry.weatherNote] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), new Date(entry.createdAt).toLocaleDateString(undefined, {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                    })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 self-start sm:self-center", children: [moodInfo && (_jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${moodInfo.color}`, children: [_jsx("span", { children: moodInfo.emoji }), _jsx("span", { children: moodInfo.label })] })), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => deleteEntryMutation.mutate(entry.id), className: "h-8 w-8 text-muted-foreground hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsx("p", { className: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap", children: entry.content }), entry.mediaUrls && entry.mediaUrls.length > 0 && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2", children: entry.mediaUrls.map((url, idx) => (_jsx("div", { className: "relative h-36 rounded-2xl overflow-hidden bg-slate-900 border border-border/80 group/photo", children: _jsx("img", { src: url, alt: `Photo ${idx + 1}`, className: "w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300" }) }, idx))) })), entry.author && (_jsxs("div", { className: "flex items-center gap-2 pt-2 text-xs text-muted-foreground", children: [_jsx("div", { className: "h-5 w-5 rounded-full overflow-hidden bg-muted", children: entry.author.avatarUrl ? (_jsx("img", { src: entry.author.avatarUrl, alt: entry.author.displayName, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center font-bold text-[9px]", children: entry.author.displayName[0] })) }), _jsxs("span", { children: ["Logged by ", entry.author.displayName] })] }))] })] }, entry.id));
                }) })), _jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Add Daily Journal Log" }) }), _jsxs("div", { className: "space-y-4 py-2", children: [_jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "col-span-1", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Day Number" }), _jsx(Input, { type: "number", placeholder: "e.g. 1", min: 1, value: dayNumber, onChange: (e) => setDayNumber(e.target.value === '' ? '' : Number(e.target.value)) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Mood & Spirit" }), _jsxs("select", { value: mood, onChange: (e) => setMood(e.target.value), className: "w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "ADVENTUROUS", children: "\uD83D\uDD25 Adventurous & Hyped" }), _jsx("option", { value: "EXCELLENT", children: "\uD83E\uDD29 Stoked & Unstoppable" }), _jsx("option", { value: "PEACEFUL", children: "\uD83E\uDDD8 Peaceful & Serene" }), _jsx("option", { value: "TIRED", children: "\uD83E\uDD71 Exhausted but Victorious" }), _jsx("option", { value: "CHALLENGING", children: "\uD83E\uDDD7 Grueling & Tested" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Story Title *" }), _jsx(Input, { placeholder: "e.g. Crossing the High Passes into Nubra", value: title, onChange: (e) => setTitle(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Location / Checkpoint" }), _jsx(Input, { placeholder: "e.g. Khardung La Top", value: location, onChange: (e) => setLocation(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Weather Note" }), _jsx(Input, { placeholder: "e.g. 8\u00B0C, Clear mountain sunshine", value: weatherNote, onChange: (e) => setWeatherNote(e.target.value) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Reflections & Road Notes *" }), _jsx("textarea", { rows: 4, placeholder: "What occurred today? How did the convoy hold up? What was the ride like?", value: content, onChange: (e) => setContent(e.target.value), className: "w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Photo URLs (one per line)" }), _jsx("textarea", { rows: 2, placeholder: "https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...", value: mediaUrlInput, onChange: (e) => setMediaUrlInput(e.target.value), className: "w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreate, disabled: !title.trim() || !content.trim() || createEntryMutation.isPending, children: "Save Memory" })] })] }) })] }));
}
//# sourceMappingURL=JournalTimeline.js.map
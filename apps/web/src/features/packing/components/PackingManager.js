import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { usePackingLists, useLuggageBags, useUpdateItemStatus, useDeletePackingItem, } from '../hooks';
import { CreateItemDialog } from './CreateItemDialog';
import { EditItemDialog } from './EditItemDialog';
import { ManageBagsDialog } from './ManageBagsDialog';
import { TemplatePickerModal } from './TemplatePickerModal';
import { AIPackingDialog } from '../../ai/AIPackingDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Luggage, Plus, Sparkles, AlertTriangle, Calendar, Layers, Edit2, Trash2, Filter, User, Check, } from 'lucide-react';
const STATUS_CONFIG = {
    NOT_PACKED: {
        label: 'Not Packed',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/80',
    },
    PACKED: {
        label: 'Packed',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    },
    WORN: {
        label: 'Worn Today',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    },
    DIRTY: {
        label: 'Dirty / Laundry',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    },
    WASHED: {
        label: 'Washed',
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
    },
    MISSING: {
        label: 'Missing / Need to Buy',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold',
    },
    UNPACKED: {
        label: 'Unpacked',
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/10 border-slate-500/30 text-slate-500',
    },
};
export function PackingManager({ trip }) {
    const { data: lists = [], isLoading } = usePackingLists(trip.id);
    const { data: bags = [] } = useLuggageBags(trip.id);
    const updateStatusMutation = useUpdateItemStatus(trip.id);
    const deleteItemMutation = useDeletePackingItem(trip.id);
    // Active view filters
    const [viewGrouping, setViewGrouping] = useState('CATEGORY');
    const [statusFilter, setStatusFilter] = useState('ALL');
    // Modals
    const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
    const [isManageBagsOpen, setIsManageBagsOpen] = useState(false);
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isAIPackingOpen, setIsAIPackingOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    // Active primary list
    const activeList = lists[0] || null;
    // Flatten all items from active list
    const allItems = useMemo(() => {
        return activeList?.items || [];
    }, [activeList]);
    // Overall Statistics
    const stats = useMemo(() => {
        const total = allItems.length;
        const packed = allItems.filter((i) => i.status === 'PACKED').length;
        const missing = allItems.filter((i) => i.status === 'MISSING').length;
        const dirty = allItems.filter((i) => i.status === 'DIRTY').length;
        const worn = allItems.filter((i) => i.status === 'WORN').length;
        const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
        return { total, packed, missing, dirty, worn, percentage };
    }, [allItems]);
    // Filter items by status
    const filteredItems = useMemo(() => {
        if (statusFilter === 'ALL')
            return allItems;
        return allItems.filter((i) => i.status === statusFilter);
    }, [allItems, statusFilter]);
    // Grouped items
    const groupedSections = useMemo(() => {
        if (viewGrouping === 'CATEGORY') {
            const groups = {};
            filteredItems.forEach((it) => {
                const cat = it.category.replace(/_/g, ' ');
                if (!groups[cat])
                    groups[cat] = [];
                groups[cat].push(it);
            });
            return Object.entries(groups).map(([title, items]) => ({ title, items }));
        }
        if (viewGrouping === 'BAG') {
            const bagMap = new Map(bags.map((b) => [b.id, b.name]));
            const groups = {};
            filteredItems.forEach((it) => {
                const bagName = it.bagId ? bagMap.get(it.bagId) || 'Assigned Bag' : 'Unassigned Gear';
                if (!groups[bagName])
                    groups[bagName] = [];
                groups[bagName].push(it);
            });
            return Object.entries(groups).map(([title, items]) => ({ title, items }));
        }
        if (viewGrouping === 'OUTFIT') {
            const groups = {};
            filteredItems.forEach((it) => {
                const outfitDay = it.dayNumber ? `Day ${it.dayNumber} Outfit` : 'General Trip Gear';
                if (!groups[outfitDay])
                    groups[outfitDay] = [];
                groups[outfitDay].push(it);
            });
            return Object.entries(groups).map(([title, items]) => ({ title, items }));
        }
        return [{ title: 'All Items', items: filteredItems }];
    }, [filteredItems, viewGrouping, bags]);
    // Status cycle: NOT_PACKED -> PACKED -> WORN -> DIRTY -> NOT_PACKED
    const handleCycleStatus = async (item) => {
        const nextMap = {
            NOT_PACKED: 'PACKED',
            PACKED: 'WORN',
            WORN: 'DIRTY',
            DIRTY: 'WASHED',
            WASHED: 'PACKED',
            MISSING: 'PACKED',
            UNPACKED: 'NOT_PACKED',
        };
        const nextStatus = nextMap[item.status] || 'PACKED';
        try {
            await updateStatusMutation.mutateAsync({ itemId: item.id, status: nextStatus });
        }
        catch {
            toast.error('Failed to update status');
        }
    };
    const handleDelete = async (itemId) => {
        try {
            await deleteItemMutation.mutateAsync(itemId);
            toast.success('Item removed');
        }
        catch {
            toast.error('Failed to remove item');
        }
    };
    if (isLoading) {
        return (_jsxs(Card, { className: "p-12 text-center rounded-3xl border-border/80", children: [_jsx("div", { className: "animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Loading packing checklist..." })] }));
    }
    // Empty state when 0 items exist
    if (allItems.length === 0) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-8 sm:p-12 rounded-3xl border-border/80 text-center space-y-5 bg-card/60 backdrop-blur-sm", children: [_jsx("div", { className: "h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-inner", children: _jsx(Luggage, { className: "h-8 w-8" }) }), _jsxs("div", { className: "max-w-md mx-auto space-y-2", children: [_jsx("h3", { className: "text-2xl font-black text-foreground tracking-tight", children: "Packing List is Empty" }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Start with curated gear templates for motorcycle expeditions, road trips, or weekend getaways, or build your custom checklist." })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 pt-2", children: [_jsxs(Button, { variant: "gradient", onClick: () => setIsAIPackingOpen(true), className: "gap-2 rounded-2xl shadow-lg shadow-primary/20 font-semibold", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "AI Gear Suggestions"] }), _jsxs(Button, { variant: "outline", onClick: () => setIsTemplateOpen(true), className: "gap-2 rounded-2xl font-semibold", children: [_jsx(Layers, { className: "h-4 w-4" }), "Use Pre-Built Template"] }), _jsxs(Button, { variant: "outline", onClick: () => setIsCreateItemOpen(true), className: "gap-2 rounded-2xl font-semibold", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Items Manually"] })] })] }), _jsx(AIPackingDialog, { trip: trip, open: isAIPackingOpen, onOpenChange: setIsAIPackingOpen }), _jsx(TemplatePickerModal, { tripId: trip.id, open: isTemplateOpen, onOpenChange: setIsTemplateOpen }), activeList && (_jsx(CreateItemDialog, { tripId: trip.id, listId: activeList.id, bags: bags, open: isCreateItemOpen, onOpenChange: setIsCreateItemOpen }))] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 shadow-sm space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "secondary", className: "font-bold text-xs uppercase tracking-wider", children: "Packing Progress" }), stats.missing > 0 && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30", children: [_jsx(AlertTriangle, { className: "h-3.5 w-3.5" }), stats.missing, " Missing Item", stats.missing > 1 ? 's' : ''] }))] }), _jsxs("h3", { className: "text-2xl font-black text-foreground tracking-tight mt-1", children: [stats.packed, " of ", stats.total, " Items Packed (", stats.percentage, "%)"] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsManageBagsOpen(true), className: "rounded-xl text-xs gap-1.5 h-9 font-semibold", children: [_jsx(Luggage, { className: "h-3.5 w-3.5 text-blue-500" }), _jsxs("span", { children: ["Bags (", bags.length, ")"] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsAIPackingOpen(true), className: "rounded-xl text-xs gap-1.5 h-9 font-semibold text-primary hover:bg-primary/10", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "AI Gear" })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsTemplateOpen(true), className: "rounded-xl text-xs gap-1.5 h-9 font-semibold", children: [_jsx(Layers, { className: "h-3.5 w-3.5 text-muted-foreground" }), _jsx("span", { children: "Templates" })] }), _jsxs(Button, { variant: "gradient", size: "sm", onClick: () => setIsCreateItemOpen(true), className: "rounded-xl text-xs gap-1.5 h-9 font-semibold shadow-sm", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Add Item" })] })] })] }), _jsx("div", { className: "w-full bg-muted/80 rounded-full h-3 overflow-hidden p-0.5", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500", style: { width: `${stats.percentage}%` } }) }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-border/60 text-xs", children: [_jsxs("div", { className: "p-2 rounded-xl bg-card border border-border/70 text-center", children: [_jsx("span", { className: "text-muted-foreground block text-[10px] font-semibold", children: "Packed" }), _jsx("span", { className: "font-bold text-emerald-600 dark:text-emerald-400 text-sm", children: stats.packed })] }), _jsxs("div", { className: "p-2 rounded-xl bg-card border border-border/70 text-center", children: [_jsx("span", { className: "text-muted-foreground block text-[10px] font-semibold", children: "To Pack" }), _jsx("span", { className: "font-bold text-foreground text-sm", children: stats.total - stats.packed })] }), _jsxs("div", { className: "p-2 rounded-xl bg-card border border-border/70 text-center", children: [_jsx("span", { className: "text-muted-foreground block text-[10px] font-semibold", children: "Worn" }), _jsx("span", { className: "font-bold text-blue-600 dark:text-blue-400 text-sm", children: stats.worn })] }), _jsxs("div", { className: "p-2 rounded-xl bg-card border border-border/70 text-center", children: [_jsx("span", { className: "text-muted-foreground block text-[10px] font-semibold", children: "Dirty / Laundry" }), _jsx("span", { className: "font-bold text-amber-600 dark:text-amber-400 text-sm", children: stats.dirty })] }), _jsxs("div", { className: "p-2 rounded-xl bg-card border border-border/70 text-center col-span-2 sm:col-span-1", children: [_jsx("span", { className: "text-muted-foreground block text-[10px] font-semibold", children: "Missing" }), _jsx("span", { className: `font-bold text-sm ${stats.missing > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`, children: stats.missing })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60", children: [_jsxs("div", { className: "flex bg-muted/60 p-1 rounded-xl border border-border/60 text-xs font-semibold self-start", children: [_jsx("button", { onClick: () => setViewGrouping('CATEGORY'), className: `px-3 py-1.5 rounded-lg transition-all ${viewGrouping === 'CATEGORY' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`, children: "By Category" }), _jsx("button", { onClick: () => setViewGrouping('BAG'), className: `px-3 py-1.5 rounded-lg transition-all ${viewGrouping === 'BAG' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`, children: "By Luggage Bag" }), _jsx("button", { onClick: () => setViewGrouping('OUTFIT'), className: `px-3 py-1.5 rounded-lg transition-all ${viewGrouping === 'OUTFIT' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`, children: "Outfit Planner" })] }), _jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs", children: [_jsxs("span", { className: "text-muted-foreground font-semibold mr-1 flex items-center gap-1 shrink-0", children: [_jsx(Filter, { className: "h-3 w-3" }), " Status:"] }), ['ALL', 'NOT_PACKED', 'PACKED', 'WORN', 'DIRTY', 'MISSING'].map((st) => (_jsx("button", { onClick: () => setStatusFilter(st), className: `px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${statusFilter === st
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted'}`, children: st === 'ALL'
                                    ? 'All'
                                    : st === 'NOT_PACKED'
                                        ? 'Not Packed'
                                        : st === 'DIRTY'
                                            ? 'Laundry'
                                            : st.charAt(0) + st.slice(1).toLowerCase() }, st)))] })] }), _jsx("div", { className: "space-y-6", children: groupedSections.map(({ title, items }) => (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h4", { className: "text-sm font-bold text-foreground capitalize flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-primary" }), title, _jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: ["(", items.length, " item", items.length > 1 ? 's' : '', ")"] })] }) }), _jsx("div", { className: "grid gap-2", children: items.map((item) => {
                                const statusMeta = STATUS_CONFIG[item.status] || STATUS_CONFIG.NOT_PACKED;
                                const isItemPacked = item.status === 'PACKED';
                                return (_jsxs(Card, { className: `p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.status === 'MISSING'
                                        ? 'bg-rose-500/5 border-rose-500/30'
                                        : isItemPacked
                                            ? 'bg-card/70 border-border/60'
                                            : 'bg-card border-border/80 hover:border-primary/40'}`, children: [_jsxs("div", { className: "flex items-start sm:items-center gap-3 flex-1 min-w-0", children: [_jsx("button", { type: "button", onClick: () => handleCycleStatus(item), className: `h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-all ${isItemPacked
                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                        : item.status === 'MISSING'
                                                            ? 'bg-rose-500 border-rose-500 text-white'
                                                            : 'border-muted-foreground/40 hover:border-primary bg-background'}`, title: "Click to toggle packed status (or advance status)", children: isItemPacked ? (_jsx(Check, { className: "h-4 w-4 stroke-[3]" })) : item.status === 'MISSING' ? (_jsx(AlertTriangle, { className: "h-3.5 w-3.5" })) : null }), _jsxs("div", { className: "space-y-1 min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: `text-sm font-bold truncate ${isItemPacked ? 'line-through text-muted-foreground' : 'text-foreground'}`, children: item.name }), item.quantity > 1 && (_jsxs("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground", children: ["\u00D7", item.quantity] })), item.isRequired && (_jsx("span", { className: "text-[10px] font-semibold text-rose-500", children: "*Required" })), item.isShared && (_jsx("span", { className: "text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20", children: "Shared Gear" })), item.weightGrams && (_jsxs("span", { className: "text-[10px] text-muted-foreground", children: [item.weightGrams, "g"] }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground", children: [item.bag && (_jsxs("span", { className: "flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md font-medium text-foreground", children: [_jsx(Luggage, { className: "h-3 w-3 text-blue-500" }), item.bag.name] })), item.dayNumber && (_jsxs("span", { className: "flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md font-medium text-foreground", children: [_jsx(Calendar, { className: "h-3 w-3 text-purple-500" }), "Day ", item.dayNumber] })), item.assignedTo && (_jsxs("span", { className: "flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md font-medium text-foreground", children: [_jsx(User, { className: "h-3 w-3 text-emerald-500" }), item.assignedTo] })), item.notes && _jsx("span", { className: "italic", children: item.notes })] })] })] }), _jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 shrink-0", children: [_jsx("button", { type: "button", onClick: () => handleCycleStatus(item), className: `text-xs px-2.5 py-1 rounded-xl border font-bold transition-all ${statusMeta.bgColor}`, title: "Click to advance status (Packed -> Worn -> Laundry)", children: statusMeta.label }), _jsxs("div", { className: "flex items-center gap-1 text-muted-foreground", children: [_jsx("button", { type: "button", onClick: () => setEditingItem(item), className: "p-1 rounded-lg hover:bg-muted hover:text-primary", title: "Edit item", children: _jsx(Edit2, { className: "h-3.5 w-3.5" }) }), _jsx("button", { type: "button", onClick: () => handleDelete(item.id), className: "p-1 rounded-lg hover:bg-muted hover:text-destructive", title: "Remove item", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] })] }, item.id));
                            }) })] }, title))) }), activeList && (_jsx(CreateItemDialog, { tripId: trip.id, listId: activeList.id, bags: bags, open: isCreateItemOpen, onOpenChange: setIsCreateItemOpen })), _jsx(ManageBagsDialog, { tripId: trip.id, bags: bags, open: isManageBagsOpen, onOpenChange: setIsManageBagsOpen }), _jsx(TemplatePickerModal, { tripId: trip.id, open: isTemplateOpen, onOpenChange: setIsTemplateOpen }), _jsx(EditItemDialog, { tripId: trip.id, item: editingItem, bags: bags, open: Boolean(editingItem), onOpenChange: (op) => !op && setEditingItem(null) }), _jsx(AIPackingDialog, { trip: trip, open: isAIPackingOpen, onOpenChange: setIsAIPackingOpen })] }));
}
//# sourceMappingURL=PackingManager.js.map
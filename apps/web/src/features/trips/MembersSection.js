import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, UserPlus, Mail, Shield, Trash2, Copy, Check, Crown, Loader2, } from 'lucide-react';
import { TripRole, addMemberSchema, } from '@waylo/shared';
import { useAddTripMember, useRemoveTripMember, useTripMembers } from './hooks';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';
export function MembersSection({ trip }) {
    const { user } = useAuthStore();
    const { data: members = trip.members || [] } = useTripMembers(trip.id);
    const addMemberMutation = useAddTripMember();
    const removeMemberMutation = useRemoveTripMember();
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [copiedInvite, setCopiedInvite] = useState(false);
    const isOwner = user?.id === trip.ownerId || user?.email === trip.owner?.displayName;
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            email: '',
            role: TripRole.MEMBER,
        },
    });
    const onAddMember = async (data) => {
        try {
            await addMemberMutation.mutateAsync({ tripId: trip.id, data });
            reset();
        }
        catch {
            // Toast handled by mutation
        }
    };
    const handleConfirmRemove = async () => {
        if (!memberToRemove)
            return;
        try {
            await removeMemberMutation.mutateAsync({
                tripId: trip.id,
                memberId: memberToRemove.id,
            });
            setMemberToRemove(null);
        }
        catch {
            // Toast handled
        }
    };
    const copyInviteLink = () => {
        const url = `${window.location.origin}/trips/${trip.id}?join=true`;
        navigator.clipboard.writeText(url);
        setCopiedInvite(true);
        toast.success('Invite link copied to clipboard!');
        setTimeout(() => setCopiedInvite(false), 2000);
    };
    const getRoleBadge = (role) => {
        switch (role) {
            case TripRole.OWNER:
                return (_jsxs(Badge, { variant: "default", className: "gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30", children: [_jsx(Crown, { className: "h-3 w-3" }), " Owner"] }));
            case TripRole.LEADER:
                return (_jsxs(Badge, { variant: "info", className: "gap-1", children: [_jsx(Shield, { className: "h-3 w-3" }), " Co-Leader"] }));
            case TripRole.MEMBER:
                return _jsx(Badge, { variant: "secondary", children: "Member" });
            case TripRole.VIEWER:
                return _jsx(Badge, { variant: "outline", children: "Viewer" });
            default:
                return _jsx(Badge, { variant: "outline", children: role });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-primary" }), _jsxs("span", { children: ["Trip Crew & Collaborators (", members.length, ")"] })] }), _jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-0.5", children: "Invite co-travelers to coordinate itineraries, manage vehicles, and settle shared bills." })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: copyInviteLink, className: "gap-2 rounded-xl shrink-0", children: [copiedInvite ? _jsx(Check, { className: "h-4 w-4 text-emerald-500" }) : _jsx(Copy, { className: "h-4 w-4" }), _jsx("span", { children: copiedInvite ? 'Link Copied' : 'Copy Invite Link' })] })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-3", children: members.map((member) => {
                            const isSelf = member.userId === user?.id;
                            const canRemove = isOwner && member.role !== TripRole.OWNER;
                            return (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40", children: [_jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [_jsxs(Avatar, { className: "h-10 w-10 ring-2 ring-primary/10", children: [member.user.avatarUrl && (_jsx(AvatarImage, { src: member.user.avatarUrl, alt: member.user.displayName })), _jsx(AvatarFallback, { className: "text-xs font-bold", children: member.user.displayName.slice(0, 2).toUpperCase() })] }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: member.user.displayName }), isSelf && (_jsx("span", { className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: "You" }))] }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: member.user.email })] })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [getRoleBadge(member.role), canRemove && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setMemberToRemove(member), className: "text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg", title: "Remove member", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] })] }, member.id));
                        }) }), _jsxs(Card, { className: "rounded-2xl border-border/80 shadow-sm p-5 h-fit", children: [_jsx(CardHeader, { className: "p-0 pb-4", children: _jsxs(CardTitle, { className: "text-base font-bold flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-4 w-4 text-primary" }), _jsx("span", { children: "Invite New Traveler" })] }) }), _jsx(CardContent, { className: "p-0", children: _jsxs("form", { onSubmit: handleSubmit(onAddMember), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "memberEmail", className: "text-xs", children: "Email Address" }), _jsx(Input, { id: "memberEmail", type: "email", placeholder: "friend@example.com", ...register('email'), className: errors.email ? 'border-destructive' : '' }), errors.email && (_jsx("p", { className: "text-xs text-destructive", children: errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "memberRole", className: "text-xs", children: "Trip Role" }), _jsxs("select", { id: "memberRole", ...register('role'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: TripRole.MEMBER, children: "Member (Can edit itinerary & expenses)" }), _jsx("option", { value: TripRole.LEADER, children: "Co-Leader (Manage bookings & members)" }), _jsx("option", { value: TripRole.VIEWER, children: "Viewer (Read-only)" })] })] }), _jsx(Button, { type: "submit", disabled: addMemberMutation.isPending, className: "w-full rounded-xl text-xs font-semibold gap-2", children: addMemberMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Sending Invite..."] })) : (_jsxs(_Fragment, { children: [_jsx(Mail, { className: "h-4 w-4" }), "Send Invite"] })) })] }) })] })] }), _jsx(ConfirmDialog, { open: Boolean(memberToRemove), onOpenChange: (open) => !open && setMemberToRemove(null), title: "Remove traveler from trip?", description: `Are you sure you want to remove ${memberToRemove?.user.displayName} from this trip? They will lose access to itineraries and checklists.`, confirmLabel: "Remove", variant: "destructive", onConfirm: handleConfirmRemove, isLoading: removeMemberMutation.isPending })] }));
}
//# sourceMappingURL=MembersSection.js.map
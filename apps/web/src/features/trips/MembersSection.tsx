import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Copy,
  Check,
  Crown,
  Loader2,
} from 'lucide-react';
import {
  TripRole,
  addMemberSchema,
  type AddMemberInput,
  type TripWithDetails,
  type TripMemberSummary,
} from '@waylo/shared';
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

interface MembersSectionProps {
  trip: TripWithDetails;
}

export function MembersSection({ trip }: MembersSectionProps) {
  const { user } = useAuthStore();
  const { data: members = trip.members || [] } = useTripMembers(trip.id);
  const addMemberMutation = useAddTripMember();
  const removeMemberMutation = useRemoveTripMember();

  const [memberToRemove, setMemberToRemove] = useState<TripMemberSummary | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const isOwner = user?.id === trip.ownerId || user?.email === trip.owner?.displayName;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: '',
      role: TripRole.MEMBER,
    },
  });

  const onAddMember = async (data: AddMemberInput) => {
    try {
      await addMemberMutation.mutateAsync({ tripId: trip.id, data });
      reset();
    } catch {
      // Toast handled by mutation
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMemberMutation.mutateAsync({
        tripId: trip.id,
        memberId: memberToRemove.id,
      });
      setMemberToRemove(null);
    } catch {
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

  const getRoleBadge = (role: TripRole) => {
    switch (role) {
      case TripRole.OWNER:
        return (
          <Badge variant="default" className="gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Crown className="h-3 w-3" /> Owner
          </Badge>
        );
      case TripRole.LEADER:
        return (
          <Badge variant="info" className="gap-1">
            <Shield className="h-3 w-3" /> Co-Leader
          </Badge>
        );
      case TripRole.MEMBER:
        return <Badge variant="secondary">Member</Badge>;
      case TripRole.VIEWER:
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Trip Crew & Collaborators ({members.length})</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Invite co-travelers to coordinate itineraries, manage vehicles, and settle shared bills.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={copyInviteLink}
          className="gap-2 rounded-xl shrink-0"
        >
          {copiedInvite ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          <span>{copiedInvite ? 'Link Copied' : 'Copy Invite Link'}</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className="lg:col-span-2 space-y-3">
          {members.map((member) => {
            const isSelf = member.userId === user?.id;
            const canRemove = isOwner && member.role !== TripRole.OWNER;

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    {member.user.avatarUrl && (
                      <AvatarImage src={member.user.avatarUrl} alt={member.user.displayName} />
                    )}
                    <AvatarFallback className="text-xs font-bold">
                      {member.user.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {member.user.displayName}
                      </p>
                      {isSelf && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getRoleBadge(member.role)}

                  {canRemove && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMemberToRemove(member)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Member Card */}
        <Card className="rounded-2xl border-border/80 shadow-sm p-5 h-fit">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span>Invite New Traveler</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onAddMember)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberEmail" className="text-xs">Email Address</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  placeholder="friend@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberRole" className="text-xs">Trip Role</Label>
                <select
                  id="memberRole"
                  {...register('role')}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={TripRole.MEMBER}>Member (Can edit itinerary & expenses)</option>
                  <option value={TripRole.LEADER}>Co-Leader (Manage bookings & members)</option>
                  <option value={TripRole.VIEWER}>Viewer (Read-only)</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={addMemberMutation.isPending}
                className="w-full rounded-xl text-xs font-semibold gap-2"
              >
                {addMemberMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Invite
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Remove Confirmation */}
      <ConfirmDialog
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title="Remove traveler from trip?"
        description={`Are you sure you want to remove ${memberToRemove?.user.displayName} from this trip? They will lose access to itineraries and checklists.`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleConfirmRemove}
        isLoading={removeMemberMutation.isPending}
      />
    </div>
  );
}

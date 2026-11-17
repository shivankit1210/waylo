import { TripStatus } from '@waylo/shared';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TripStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case TripStatus.ONGOING:
      return (
        <Badge
          variant="success"
          className={cn('gap-1.5 font-semibold uppercase tracking-wider text-[11px]', className)}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          Ongoing
        </Badge>
      );
    case TripStatus.PLANNED:
      return (
        <Badge
          variant="info"
          className={cn('font-semibold uppercase tracking-wider text-[11px]', className)}
        >
          Planned
        </Badge>
      );
    case TripStatus.DRAFT:
      return (
        <Badge
          variant="outline"
          className={cn('font-semibold uppercase tracking-wider text-[11px] text-muted-foreground border-dashed', className)}
        >
          Draft
        </Badge>
      );
    case TripStatus.COMPLETED:
      return (
        <Badge
          variant="secondary"
          className={cn('font-semibold uppercase tracking-wider text-[11px] bg-slate-500/15 text-slate-600 dark:text-slate-300', className)}
        >
          Completed
        </Badge>
      );
    case TripStatus.CANCELLED:
      return (
        <Badge
          variant="destructive"
          className={cn('font-semibold uppercase tracking-wider text-[11px]', className)}
        >
          Cancelled
        </Badge>
      );
    case TripStatus.ARCHIVED:
      return (
        <Badge
          variant="outline"
          className={cn('font-semibold uppercase tracking-wider text-[11px] text-muted-foreground', className)}
        >
          Archived
        </Badge>
      );
    default:
      return <Badge className={className}>{status}</Badge>;
  }
}

import { useState } from 'react';
import {
  WifiOff,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div
      className={`w-full transition-all duration-300 z-50 ${
        !isOnline
          ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white'
          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white'
      } py-2.5 px-4 shadow-md text-xs`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            {!isOnline ? (
              <WifiOff className="h-4 w-4 animate-pulse text-white" />
            ) : (
              <CloudUpload className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold uppercase tracking-wider text-[11px]">
                {!isOnline ? 'Offline Mountain Mode' : 'Online Sync Available'}
              </span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black">
                  {pendingCount} Pending Change{pendingCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              {!isOnline
                ? 'Your offline itinerary, packing lists, and cached map tiles are active. Changes will auto-sync when back in cellular coverage.'
                : 'Connection restored. Offline actions are ready to save to Waylo cloud.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {pendingCount > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={syncNow}
              disabled={!isOnline || isSyncing}
              className="rounded-xl font-bold text-xs gap-1.5 h-8 bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </Button>
          )}

          {!isOnline && (
            <span className="text-[10px] text-white/80 font-medium hidden md:inline">
              IndexedDB Storage Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { offlineStorage, type QueuedAction } from './offlineStorage';
import { toast } from 'sonner';

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingQueue, setPendingQueue] = useState<QueuedAction[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Refresh queue count
  const refreshQueue = useCallback(async () => {
    const queue = await offlineStorage.getQueue();
    setPendingQueue(queue);
  }, []);

  // Process and replay offline queue
  const syncNow = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    const queue = await offlineStorage.getQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    let successCount = 0;
    let failCount = 0;

    for (const action of queue) {
      try {
        if (action.method === 'POST') {
          await apiClient.post(action.endpoint, action.payload);
        } else if (action.method === 'PATCH') {
          await apiClient.patch(action.endpoint, action.payload);
        } else if (action.method === 'PUT') {
          await apiClient.put(action.endpoint, action.payload);
        } else if (action.method === 'DELETE') {
          await apiClient.delete(action.endpoint);
        }

        await offlineStorage.removeAction(action.id);
        successCount++;
      } catch (err) {
        console.warn('Failed to replay queued action:', action, err);
        failCount++;
      }
    }

    await refreshQueue();
    setIsSyncing(false);

    if (successCount > 0) {
      toast.success(
        `Cloud Sync Complete: ${successCount} offline change${
          successCount > 1 ? 's' : ''
        } saved to Waylo!`,
        { icon: '☁️' }
      );
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip'] });
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      queryClient.invalidateQueries({ queryKey: ['packing'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }

    if (failCount > 0) {
      toast.error(`${failCount} changes failed to sync. Will retry automatically.`);
    }
  }, [isSyncing, queryClient, refreshQueue]);

  // Online / Offline window listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connection restored. Syncing offline changes...', {
        icon: '🟢',
      });
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Waylo is running in Offline Mountain Mode.', {
        icon: '📡',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load
    refreshQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncNow, refreshQueue]);

  return {
    isOnline,
    pendingQueue,
    pendingCount: pendingQueue.length,
    isSyncing,
    syncNow,
    refreshQueue,
  };
}

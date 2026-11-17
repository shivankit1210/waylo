import { type QueuedAction } from './offlineStorage';
export declare function useOfflineSync(): {
    isOnline: boolean;
    pendingQueue: QueuedAction[];
    pendingCount: number;
    isSyncing: boolean;
    syncNow: () => Promise<void>;
    refreshQueue: () => Promise<void>;
};
//# sourceMappingURL=useOfflineSync.d.ts.map
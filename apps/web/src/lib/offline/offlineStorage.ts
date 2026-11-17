// ============================================================
// Waylo Offline Storage Engine (IndexedDB)
// ============================================================

const DB_NAME = 'WayloOfflineDB';
const DB_VERSION = 1;

export interface QueuedAction {
  id: string;
  tripId?: string;
  type: string; // e.g. 'TOGGLE_STOP' | 'UPDATE_PACKING' | 'CREATE_EXPENSE'
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  createdAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Store: Cached Trips
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }

      // Store: Sync Queue
      if (!db.objectStoreNames.contains('syncQueue')) {
        const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        queueStore.createIndex('byTrip', 'tripId', { unique: false });
        queueStore.createIndex('byDate', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const offlineStorage = {
  /**
   * Save trip data in IndexedDB for offline viewing
   */
  async saveTrip(trip: any): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('trips', 'readwrite');
        const store = tx.objectStore('trips');
        store.put({ ...trip, cachedAt: new Date().toISOString() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Failed to save trip offline:', err);
    }
  },

  /**
   * Retrieve cached trip data by ID
   */
  async getTrip(tripId: string): Promise<any | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('trips', 'readonly');
        const store = tx.objectStore('trips');
        const req = store.get(tripId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  },

  /**
   * Retrieve all cached trips
   */
  async getAllTrips(): Promise<any[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('trips', 'readonly');
        const store = tx.objectStore('trips');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  /**
   * Enqueue a pending mutation action while offline
   */
  async enqueueAction(
    action: Omit<QueuedAction, 'id' | 'createdAt'>
  ): Promise<QueuedAction> {
    const item: QueuedAction = {
      ...action,
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('syncQueue', 'readwrite');
        const store = tx.objectStore('syncQueue');
        store.put(item);
        tx.oncomplete = () => resolve(item);
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      return item;
    }
  },

  /**
   * Get all pending queued actions in order
   */
  async getQueue(): Promise<QueuedAction[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('syncQueue', 'readonly');
        const store = tx.objectStore('syncQueue');
        const req = store.getAll();
        req.onsuccess = () => {
          const list: QueuedAction[] = req.result || [];
          list.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  /**
   * Remove a completed action from the queue
   */
  async removeAction(id: string): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('syncQueue', 'readwrite');
        const store = tx.objectStore('syncQueue');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Failed to remove queued action:', err);
    }
  },

  /**
   * Clear all pending queued actions
   */
  async clearQueue(): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('syncQueue', 'readwrite');
        const store = tx.objectStore('syncQueue');
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Failed to clear sync queue:', err);
    }
  },
};

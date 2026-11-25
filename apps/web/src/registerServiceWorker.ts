// ============================================================
// Service Worker Registration
// ============================================================

export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // In development mode, actively unregister any stale service workers and purge caches
    if (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then(() => {
            console.log('🧹 Unregistered dev ServiceWorker:', registration.scope);
          });
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key).then(() => {
              console.log('🧹 Purged dev cache:', key);
            });
          }
        });
      }
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            '🚀 Waylo PWA ServiceWorker registered with scope:',
            registration.scope
          );

          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('🔄 New version of Waylo available! Reloading...');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('Waylo ServiceWorker registration failed:', error);
        });
    });
  }
}

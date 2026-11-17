// ============================================================
// Service Worker Registration
// ============================================================

export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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

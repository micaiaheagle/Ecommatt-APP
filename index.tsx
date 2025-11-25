import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- FORCE CACHE CLEARING ---
if ('serviceWorker' in navigator) {
  // Only attempt cleanup once page is fully loaded to avoid 'invalid state' errors
  window.addEventListener('load', async () => {
    try {
      // Defensive check: verify we can access the API
      if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistrations) return;

      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations && registrations.length > 0) {
          for(let registration of registrations) {
            console.log('Unregistering Service Worker to force update:', registration);
            await registration.unregister();
          }
          // Force reload to ensure fresh assets are fetched
          if (!sessionStorage.getItem('sw_cleared_v57')) {
              sessionStorage.setItem('sw_cleared_v57', 'true');
              window.location.reload();
          }
      }
    } catch (e) {
      // Suppress errors during cleanup
      console.debug('SW Cleanup skipped (harmless)');
    }
  });
}
// --------------------------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
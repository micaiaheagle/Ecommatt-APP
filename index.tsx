
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- FORCE CACHE CLEARING ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Check if document is in a valid state before querying SW
      if (document.visibilityState === 'visible' || document.readyState === 'complete') {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for(let registration of registrations) {
            console.log('Unregistering Service Worker:', registration);
            await registration.unregister();
          }
          // Force reload if we found and killed a SW to get fresh assets
          if (registrations.length > 0 && !sessionStorage.getItem('sw_cleared')) {
              sessionStorage.setItem('sw_cleared', 'true');
              window.location.reload();
          }
      }
    } catch (e) {
      // Silently fail if SW API is restricted or document state is invalid
      console.debug('SW Cleanup skipped:', e);
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
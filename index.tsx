
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- FORCE CACHE CLEARING FOR v4.0 UPDATE ---
// Safer implementation wrapped in load event to prevent "Invalid State" errors
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        console.log('Unregistering stuck SW:', registration);
        registration.unregister();
      }
      // Force reload if we found and killed a SW to get fresh assets
      if (registrations.length > 0 && !sessionStorage.getItem('sw_cleared')) {
          sessionStorage.setItem('sw_cleared', 'true');
          window.location.reload();
      }
    }).catch(err => {
      console.warn('Service Worker cleanup skipped:', err);
    });
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

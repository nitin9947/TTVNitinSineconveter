// Failsafe for window.fetch getter-only error in sandboxed iframe runtime
try {
  let _fetch = window.fetch ? window.fetch.bind(window) : undefined;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _fetch;
    },
    set(newFetch) {
      _fetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignore if already configurable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

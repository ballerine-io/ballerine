import React from 'react';
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './App';
import './i18n';
import { worker } from './mock-service-worker/browser';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

void (async () => {
  try {
    await worker.start();
    root.render(
      <React.StrictMode>
        <React.Suspense fallback="loading">
          <App />
        </React.Suspense>
      </React.StrictMode>,
    );
    console.log('Mock service worker started.');
  } catch (err) {
    console.error(err);
  }
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

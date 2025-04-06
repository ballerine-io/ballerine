import '@total-typescript/ts-reset';

import { initializeMonitoring } from '@/initialize-monitoring/initialize-monitoring';
import '@ballerine/ui/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import './i18next';
import './index.css';

try {
  initializeMonitoring();
} catch (error) {
  console.error('Failed to initialize monitoring:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);

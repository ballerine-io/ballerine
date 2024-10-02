import '@total-typescript/ts-reset';

import { ThemeProvider } from '@/common/providers/ThemeProvider/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import { initializeMonitoring } from '@/initialize-monitoring/initialize-monitoring';
import { initializeSessionRecording } from '@/initialize-session-recording/initialize-session-recording';
import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { Head } from './Head';
import './i18next';
import './index.css';

try {
  initializeMonitoring();
} catch (error) {
  console.error('Failed to initialize monitoring:', error);
}

try {
  initializeSessionRecording();
} catch (error) {
  console.error('Failed to initialize session recording:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Head />
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

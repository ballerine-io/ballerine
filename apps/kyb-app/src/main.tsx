import '@total-typescript/ts-reset';

import { SettingsProvider } from '@/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import settingsJson from '../settings.json';
import { App } from './App';
import { Head } from './Head';
import './i18next';
import './index.css';
import { initializeMonitoring } from '@/initialize-monitoring/initialize-monitoring';

initializeMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Head />
        <SettingsProvider settings={settingsJson}>
          <ThemeProvider theme={settingsJson.theme}>
            <App />
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

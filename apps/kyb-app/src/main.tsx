import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import '@ballerine/ui/dist/style.css';
import settingsJson from '../settings.json';
import { SettingsProvider } from '@app/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@app/common/providers/ThemeProvider/ThemeProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client';
import { Head } from './Head';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Head />
      <SettingsProvider settings={settingsJson}>
        <ThemeProvider theme={settingsJson.theme}>
          <App />
        </ThemeProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

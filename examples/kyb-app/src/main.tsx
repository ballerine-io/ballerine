import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import settingsJson from '../settings.json';
import { SettingsProvider } from '@app/common/providers/SettingsProvider/SettingsProvider.tsx';
import { ThemeProvider } from '@app/common/providers/ThemeProvider/ThemeProvider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider settings={settingsJson}>
        <ThemeProvider theme={settingsJson.theme}>
          <App />
        </ThemeProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

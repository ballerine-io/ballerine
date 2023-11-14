import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import '@ballerine/ui/dist/style.css';
import settingsJson from '../settings.json';
import { SettingsProvider } from '@/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider/ThemeProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/common/utils/query-client';
import { Head } from './Head';
import * as Sentry from '@sentry/react';
import { sentyRouterInstrumentation } from './router';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT_NAME || 'development',
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  debug: !!import.meta.env.DEBUG,
  normalizeDepth: 15,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: sentyRouterInstrumentation,

      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/ballerine\.dev\/api/,
        /^https:\/\/ballerine\.app\/api/,
        /^https:\/\/ballerine\.io\/api/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: true,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions

  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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

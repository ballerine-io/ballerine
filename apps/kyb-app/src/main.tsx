import '@total-typescript/ts-reset';

import { SettingsProvider } from '@/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import '@ballerine/ui/dist/style.css';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import settingsJson from '../settings.json';
import { App } from './App';
import { Head } from './Head';
import './i18next';
import './index.css';
import { sentyRouterInstrumentation } from './router';
import posthog from 'posthog-js';

if (
  !window.location.host.includes('127.0.0.1') &&
  !window.location.host.includes('localhost') &&
  import.meta.env.VITE_POSTHOG_KEY &&
  import.meta.env.VITE_POSTHOG_HOST
) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'identified_only',
    loaded: ph => {
      ph.register_for_session({ environment: import.meta.env.VITE_ENVIRONMENT_NAME });
    },
  });
}

const getApiOrigin = () => {
  const url = new URL(import.meta.env.VITE_API_URL);

  return url.origin;
};

Sentry.init({
  // @ts-ignore
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
      networkDetailAllowUrls: [getApiOrigin()],
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

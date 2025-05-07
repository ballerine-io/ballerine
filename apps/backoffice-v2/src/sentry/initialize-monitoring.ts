import { env } from '@/common/env/env';
import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export const initializeMonitoring = () => {
  if (window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
    return;
  }

  if (env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),
        Sentry.browserProfilingIntegration(),
        Sentry.replayIntegration(),
        Sentry.captureConsoleIntegration(),
      ],

      tracesSampleRate: 1.0,

      ...(env.VITE_SENTRY_PROPAGATION_TARGET && {
        tracePropagationTargets: [env.VITE_SENTRY_PROPAGATION_TARGET],
      }),

      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

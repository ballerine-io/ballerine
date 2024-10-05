import posthog from 'posthog-js';
import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { env } from '@/common/env/env';

export const initializeMonitoring = () => {
  if (window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
    return;
  }

  if (env.VITE_POSTHOG_KEY && env.VITE_POSTHOG_HOST) {
    posthog.init(env.VITE_POSTHOG_KEY, {
      api_host: env.VITE_POSTHOG_HOST,
      person_profiles: 'identified_only',
      loaded: ph => {
        ph.register_for_session({ environment: env.VITE_ENVIRONMENT_NAME });
      },
    });
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

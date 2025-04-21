import { getApiOrigin } from '@/common/utils/get-api-origin/get-api-origin';
import { env } from '@/env/env';
import { sentryRouterInstrumentation } from '@/router';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

export const initializeMonitoring = () => {
  if (window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
    return;
  }

  if (env.VITE_POSTHOG_KEY && env.VITE_POSTHOG_HOST) {
    posthog.init(env.VITE_POSTHOG_KEY, {
      api_host: env.VITE_POSTHOG_HOST,
      persistence: 'sessionStorage',
      person_profiles: 'identified_only',
      loaded: ph => {
        ph.register_for_session({ environment: env.VITE_ENVIRONMENT_NAME });
      },
    });

    const originalCapture = posthog.capture;
    posthog.capture = (eventName, properties = {}, options) => {
      const propertiesWithEnv = {
        ...properties,
        environment: env.VITE_ENVIRONMENT_NAME,
      };

      return originalCapture.call(posthog, eventName, propertiesWithEnv, options);
    };
  }

  if (env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      environment: env.VITE_ENVIRONMENT_NAME,
      debug: env.VITE_DEBUG,
      normalizeDepth: 15,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: sentryRouterInstrumentation,

          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          ...(env.VITE_SENTRY_PROPAGATION_TARGET && {
            tracePropagationTargets: [env.VITE_SENTRY_PROPAGATION_TARGET],
          }),
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
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
};

export const updateSentryUser = (userMetadata: {
  id?: string;
  email?: string;
  fullName?: string;
}) => {
  Sentry.setUser({
    id: userMetadata.id,
    email: userMetadata.email,
    username: userMetadata.fullName,
  });
};

export const updatePostHogUser = (userMetadata: {
  id?: string;
  email?: string;
  fullName?: string;
}) => {
  if (userMetadata.email) {
    posthog.identify(userMetadata.email, userMetadata);
  }
};

export const clearSentryUser = () => {
  Sentry.setUser(null);
};

export const clearPostHogUser = () => {
  posthog.reset();
};

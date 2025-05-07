import { env } from '@/common/env/env';
import * as Sentry from '@sentry/react';

export const captureSentryError = (error: Error, errorInfo?: Record<string, unknown>) => {
  if (env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, errorInfo ? { extra: { errorInfo } } : undefined);
  }
};

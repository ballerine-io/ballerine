import { isAxiosError } from 'axios';
import * as Sentry from '@sentry/node';

export const alertWebhookFailure = (error: unknown) => {
  const errorToAlert = new Error(`Failed to send a webhook`, { cause: error });
  const context = isAxiosError(error) ? { ...error } : {};

  Sentry.captureException(errorToAlert, {
    extra: context,
  });
};

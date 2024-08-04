import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@total-typescript/ts-reset';

import '@ballerine/ui/dist/style.css';
import '@fontsource/inter';

import { Toaster } from '@/common/components/organisms/Toaster/Toaster';
import { registerFont } from '@ballerine/react-pdf-toolkit';
import { Font } from '@react-pdf/renderer';
import { Router } from './Router/Router';
import { env } from './common/env/env';
import './i18n';
import './index.css';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import posthog from 'posthog-js';

if (
  !window.location.host.includes('127.0.0.1') &&
  !window.location.host.includes('localhost') &&
  env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY &&
  env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST
) {
  posthog.init(env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY!, {
    api_host: env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST!,
    person_profiles: 'identified_only',
    loaded: ph => {
      ph.register_for_session({ environment: env.VITE_ENVIRONMENT_NAME });
    },
  });
}

dayjs.extend(advancedFormat);

registerFont(Font);

export const TOAST_DURATION_IN_MS = 1000 * 3;

const rootElement = document.getElementById('root');

/// Avoid race conditions when using the mock server.
const prepare = async () => {
  if (env.VITE_MOCK_SERVER) {
    const { worker } = await import('./lib/mock-service-worker/browser');

    return worker.start();
  }

  return Promise.resolve();
};

void prepare().then(() => {
  if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <Router />
        <Toaster position={'top-right'} duration={TOAST_DURATION_IN_MS} visibleToasts={5} />
      </StrictMode>,
    );
  }
});

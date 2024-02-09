import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@ballerine/ui/dist/style.css';
import '@fontsource/inter';

import { Router } from './Router/Router';
import { env } from './common/env/env';
import './i18n';
import './index.css';
import { Toaster } from '@/common/components/organisms/Toaster/Toaster';

export const TOAST_DURATION_IN_MS = 1000 * 3;

const rootElement = document.getElementById('root');

// Avoid race conditions when using the mock server.
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
        <Toaster position={'top-center'} duration={TOAST_DURATION_IN_MS} visibleToasts={1} />
      </StrictMode>,
    );
  }
});

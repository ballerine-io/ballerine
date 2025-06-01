import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@total-typescript/ts-reset';

import '@ballerine/ui/dist/style.css';
import '@fontsource/inter';

import { Toaster } from '@/common/components/organisms/Toaster/Toaster';
// Uncomment once react-pdf is back in use
// import { Font } from '@react-pdf/renderer';
import { Router } from './router';
import { env } from './common/env/env';
import './i18n';
import './index.css';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { initializeMonitoring } from '@/sentry/initialize-monitoring';

initializeMonitoring();

dayjs.extend(advancedFormat);

// registerFont(Font);

export const TOAST_DURATION_IN_MS = 1000 * 3;

const rootElement = document.getElementById('root');

if (rootElement && !rootElement?.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Router />
      <Toaster position={'top-right'} duration={TOAST_DURATION_IN_MS} visibleToasts={5} />
    </StrictMode>,
  );
}

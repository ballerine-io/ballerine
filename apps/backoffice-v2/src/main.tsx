import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@ballerine/ui/dist/style.css';
import '@fontsource/inter';

import './index.css';
import './i18n';
import { env } from './common/env/env';
import { ReportTemplate } from '@/lib/pdf-toolkit/templates/report/Report';

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
        {/* <Router /> */}
        <ReportTemplate />
      </StrictMode>,
    );
  }
});

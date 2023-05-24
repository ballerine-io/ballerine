import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App/App';
import './i18n';
import { env } from './common/env/env';

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
        <App />
      </StrictMode>,
    );
  }
});

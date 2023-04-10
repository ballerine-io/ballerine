import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App/App';
import './i18';

const rootElement = document.getElementById('root');

// Avoid race conditions when using the mock server.
const prepare = async () => {
  if (import.meta.env.VITE_MOCK_SERVER === 'true') {
    const { worker } = await import('./lib/mock-service-worker/browser');

    return worker.start();
  }

  return Promise.resolve();
};

prepare().then(() => {
  if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
});

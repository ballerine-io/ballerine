import { router } from '@/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import posthog from 'posthog-js';

if (
  !window.location.host.includes('127.0.0.1') &&
  !window.location.host.includes('localhost') &&
  import.meta.env.VITE_POSTHOG_KEY &&
  import.meta.env.VITE_POSTHOG_HOST
) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'identified_only',
    loaded: (ph: { register_for_session: (arg0: { environment: any }) => void }) => {
      ph.register_for_session({ environment: import.meta.env.VITE_ENVIRONMENT_NAME });
    },
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);

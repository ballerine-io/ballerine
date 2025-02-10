import { router } from '@/router';
import '@ballerine/ui/dist/style.css';
import * as Sentry from '@sentry/react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { version } from '../package.json';

window.appVersion = version;

window.toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};

export const App = () => {
  return (
    <Sentry.ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </Sentry.ErrorBoundary>
  );
};

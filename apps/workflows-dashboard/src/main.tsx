import { router } from '@/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { initializeMonitoring } from '@/initialize-monitoring/initialize-monitoring';
import '../public/config.js?url';

initializeMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);

//@ts-ignore
globalThis.env = globalThis.env || {
  API_URL: import.meta.env.VITE_API_URL,
};

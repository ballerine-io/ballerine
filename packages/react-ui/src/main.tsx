import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './global.css';
import { Test } from './components/Test';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>,
);

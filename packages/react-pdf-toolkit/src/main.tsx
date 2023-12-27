import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReportTemplate } from './templates/report';
import { Badge } from '@/components/Badge';
import { ViewerDEV } from '@/components/ViewerDEV';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <ReportTemplate />
    </ViewerDEV>
  </div>,
);

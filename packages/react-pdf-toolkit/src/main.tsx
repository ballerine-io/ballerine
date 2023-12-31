import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReportTemplate, reportData } from './templates/report';
import { ViewerDEV } from '@/components/ViewerDEV';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
registerFont(Font);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <ReportTemplate report={reportData} />
    </ViewerDEV>
  </div>,
);

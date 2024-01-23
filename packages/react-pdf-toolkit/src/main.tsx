import { ViewerDEV } from '@/components/ViewerDEV';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { IReport, ReportTemplate } from './templates/report';
registerFont(Font);

const reportData: Partial<IReport> = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <ReportTemplate report={reportData as IReport} version={1} />
    </ViewerDEV>
  </div>,
);

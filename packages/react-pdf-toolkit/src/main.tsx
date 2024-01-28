import { Document, Page } from '@react-pdf/renderer';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { ViewerDEV } from '@/components/misc/ViewerDEV';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <Document>
        <Page></Page>
      </Document>
    </ViewerDEV>
  </div>,
);

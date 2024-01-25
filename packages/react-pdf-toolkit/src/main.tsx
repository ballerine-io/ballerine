import { registerFont } from '@/theme';
import { Document, Font, Page } from '@react-pdf/renderer';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { ViewerDEV } from '@/components/misc/ViewerDEV';
registerFont(Font);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <Document>
        <Page wrap={false}></Page>
      </Document>
    </ViewerDEV>
  </div>,
);

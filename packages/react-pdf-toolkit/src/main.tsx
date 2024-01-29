import { ViewerDEV } from '@/components/misc/ViewerDEV';
import { Document } from '@react-pdf/renderer';
import ReactDOM from 'react-dom/client';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <Document></Document>
    </ViewerDEV>
  </div>,
);

import { PDFViewer } from '@react-pdf/renderer';

//@ts-ignore
export const ViewerDEV = ({ children }: { children: any }) => (
  <PDFViewer width="100%" height="100%">
    {children}
  </PDFViewer>
);

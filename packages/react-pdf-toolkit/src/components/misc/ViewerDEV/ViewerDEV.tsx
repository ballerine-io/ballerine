import { PDFViewer } from '@react-pdf/renderer';

export const ViewerDEV = ({ children }: React.ComponentProps<typeof PDFViewer>) => (
  <PDFViewer width="100%" height="100%">
    {children}
  </PDFViewer>
);

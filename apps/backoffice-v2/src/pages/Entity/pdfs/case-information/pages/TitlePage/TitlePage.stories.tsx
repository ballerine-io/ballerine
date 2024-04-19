import { registerFont } from '@ballerine/react-pdf-toolkit';
import { Document, Font, PDFViewer } from '@react-pdf/renderer';
import { TitlePage } from './TitlePage';

registerFont(Font);

export default {
  component: TitlePage,
};

export const Default = {
  render: () => (
    <PDFViewer width="100%" height="100%">
      <Document>
        <TitlePage />
      </Document>
    </PDFViewer>
  ),
};

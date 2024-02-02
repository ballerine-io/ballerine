import {
  Ecosystem,
  LineOfBusiness,
  PaymentEnvironment,
  SocialMedia,
  Summary,
  TransactionLaundering,
  WebsiteCompanyAnalysis,
  registerFont,
} from '@ballerine/react-pdf-toolkit';
import { AnyObject } from '@ballerine/ui';
import { Document, Font, PDFViewer } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

registerFont(Font);

export interface PDFReportCell {
  reportData: AnyObject;
}

export const PDFReportCell: FunctionComponent<PDFReportCell> = ({ reportData }) => {
  return (
    <PDFViewer width="100%" height="800px">
      <Document>
        <Summary />
        <LineOfBusiness />
        <Ecosystem />
        <TransactionLaundering />
        <WebsiteCompanyAnalysis />
        <SocialMedia data={reportData?.socialMedia} />
        <PaymentEnvironment />
      </Document>
    </PDFViewer>
  );
};

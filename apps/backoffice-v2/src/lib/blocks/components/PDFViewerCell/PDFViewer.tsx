import { IPDFViewerProps } from '@/lib/blocks/components/PDFViewerCell/interfaces';
import { PDFViewer } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const PDFViewerCell: FunctionComponent<IPDFViewerProps> = ({ props, value }) => {
  const { width, height } = props;

  return (
    <PDFViewer width={width} height={height}>
      {value}
    </PDFViewer>
  );
};

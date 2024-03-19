import { IPDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/interfaces';
import { FunctionComponent } from 'react';

export const PDFViewerCell: FunctionComponent<IPDFViewerCell> = ({ props, value }) => {
  const { width, height } = props;

  if (!value) return null;

  return (
    <iframe src={`data:application/pdf;base64,${value}#navpanes=0`} width={width} height={height} />
  );
};

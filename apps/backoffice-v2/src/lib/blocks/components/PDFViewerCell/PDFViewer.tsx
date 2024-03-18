import { TPDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/interfaces';
import { FunctionComponent } from 'react';

export const PDFViewerCell: FunctionComponent<TPDFViewerCell> = ({ props, value }) => {
  const { width, height } = props;

  return value ? <iframe src={`${value}#navpanes=0`} width={width} height={height} /> : null;
};

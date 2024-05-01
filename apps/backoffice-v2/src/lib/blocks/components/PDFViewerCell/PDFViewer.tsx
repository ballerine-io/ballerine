import { TPDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/interfaces';
import { FunctionComponent } from 'react';

export const PDFViewerCell: FunctionComponent<TPDFViewerCell> = ({ props, value }) => {
  const { width, height } = props;

  if (!value) {
    return;
  }

  return <iframe src={value} width={width} height={height} />;
};

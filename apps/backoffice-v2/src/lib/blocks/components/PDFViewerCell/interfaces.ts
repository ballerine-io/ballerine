export interface IPDFViewerProps {
  width: string;
  height: string;
}

export type TPDFViewerCell = {
  type: 'pdfViewer';
  value: string;
  props: IPDFViewerProps;
};

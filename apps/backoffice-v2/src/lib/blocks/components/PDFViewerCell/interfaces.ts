export interface IPDFViewerProps {
  width: string;
  height: string;
}

export interface IPDFViewerCell {
  type: 'pdfViewer';
  value: string;
  props: IPDFViewerProps;
}

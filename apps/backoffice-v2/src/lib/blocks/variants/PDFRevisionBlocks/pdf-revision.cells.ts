import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { PDFReportCell } from '@/lib/blocks/variants/PDFRevisionBlocks/cells/PDFReportCell';

export const pdfRevisionCells = {
  ...cells,
  'pdf-report': PDFReportCell,
};

import { Alert } from '@/common/components/atoms/Alert/Alert';
import { BadgeCell } from '@/lib/blocks/components/BadgeCell/BadgeCell';
import { BlockCell } from '@/lib/blocks/components/BlockCell/BlockCell';
import { CallToAction } from '@/lib/blocks/components/CallToAction/CallToAction';
import { CallToActionLegacy } from '@/lib/blocks/components/CallToActionLegacy/CallToActionLegacy';
import { CaseCallToActionLegacy } from '@/lib/blocks/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { Container } from '@/lib/blocks/components/Container/Container';
import { Details } from '@/lib/blocks/components/Details/Details';
import { DialogCell } from '@/lib/blocks/components/DialogCell/DialogCell';
import { FaceComparison } from '@/lib/blocks/components/FaceComparison/FaceComparison';
import { Heading } from '@/lib/blocks/components/Heading/Heading';
import { MapCell } from '@/lib/blocks/components/MapCell/MapCell';
import { MultiDocuments } from '@/lib/blocks/components/MultiDocuments/MultiDocuments';
import { NestedDetails } from '@/lib/blocks/components/NestedDetails/NestedDetails';
import { NodeCell } from '@/lib/blocks/components/NodeCell/NodeCell';
import { PDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/PDFViewer';
import { Paragraph } from '@/lib/blocks/components/Paragraph/Paragraph';
import { Subheading } from '@/lib/blocks/components/Subheading/Subheading';
import { TableCell } from '@/lib/blocks/components/TableCell/TableCell';
import { TCell } from '@/lib/blocks/create-blocks-typed/types';
import { CellsMap, createBlocks } from '@ballerine/blocks';
import { DataTableCell } from '@/lib/blocks/components/DataTableCell/DataTableCell';

export const createBlocksTyped = () => createBlocks<TCell>();

const blocks = createBlocksTyped();

declare module '@ballerine/blocks' {
  interface BlocksClient {
    cells: typeof blocks;
  }
}

export const cells: CellsMap = {
  heading: Heading,
  subheading: Subheading,
  alert: Alert,
  badge: BadgeCell,
  container: Container,
  callToActionLegacy: CallToActionLegacy,
  callToAction: CallToAction,
  faceComparison: FaceComparison,
  details: Details,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocuments,
  map: MapCell,
  caseCallToActionLegacy: CaseCallToActionLegacy,
  table: TableCell,
  dataTable: DataTableCell,
  paragraph: Paragraph,
  dialog: DialogCell,
  block: BlockCell,
  node: NodeCell,
  pdfViewer: PDFViewerCell,
};

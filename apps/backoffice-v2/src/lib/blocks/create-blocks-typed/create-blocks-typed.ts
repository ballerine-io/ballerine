import { Alert } from '@/common/components/atoms/Alert/Alert';
import { BadgeCell } from '@/lib/blocks/components/BadgeCell/BadgeCell';
import { BlockCell } from '@/lib/blocks/components/BlockCell/BlockCell';
import { CallToAction } from '@/lib/blocks/components/CallToAction/CallToAction';
import { CallToActionLegacy } from '@/lib/blocks/components/CallToActionLegacy/CallToActionLegacy';
import { CaseCallToActionLegacy } from '@/lib/blocks/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { ContainerCell } from '@/lib/blocks/components/ContainerCell/ContainerCell';
import { DataTableCell } from '@/lib/blocks/components/DataTableCell/DataTableCell';
import { DetailsCell } from '@/lib/blocks/components/DetailsCell/DetailsCell';
import { DialogCell } from '@/lib/blocks/components/DialogCell/DialogCell';
import { FaceComparison } from '@/lib/blocks/components/FaceComparison/FaceComparison';
import { HeadingCell } from '@/lib/blocks/components/HeadingCell/HeadingCell';
import { ImageCell } from '@/lib/blocks/components/ImageCell/ImageCell';
import { MapCell } from '@/lib/blocks/components/MapCell/MapCell';
import { MultiDocumentsCell } from '@/lib/blocks/components/MultiDocumentsCell/MultiDocumentsCell';
import { NestedDetails } from '@/lib/blocks/components/NestedDetails/NestedDetails';
import { NodeCell } from '@/lib/blocks/components/NodeCell/NodeCell';
import { PDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/PDFViewer';
import { Paragraph } from '@/lib/blocks/components/Paragraph/Paragraph';
import { ReadOnlyDetailsCell } from '@/lib/blocks/components/ReadOnlyDetailsCell/ReadOnlyDetailsCell';
import { Subheading } from '@/lib/blocks/components/Subheading/Subheading';
import { TableCell } from '@/lib/blocks/components/TableCell/TableCell';
import { TCell } from '@/lib/blocks/create-blocks-typed/types';
import { CellsMap, createBlocks } from '@ballerine/blocks';
import { EditableDetailsV2Cell } from '../components/EditableDetailsV2Cell/EditableDetailsV2Cell';

export const createBlocksTyped = () => createBlocks<TCell>();

const blocks = createBlocksTyped();

declare module '@ballerine/blocks' {
  interface BlocksClient {
    cells: typeof blocks;
  }
}

export const cells: CellsMap = {
  heading: HeadingCell,
  subheading: Subheading,
  alert: Alert,
  badge: BadgeCell,
  container: ContainerCell,
  callToActionLegacy: CallToActionLegacy,
  callToAction: CallToAction,
  faceComparison: FaceComparison,
  details: DetailsCell,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocumentsCell,
  map: MapCell,
  caseCallToActionLegacy: CaseCallToActionLegacy,
  table: TableCell,
  dataTable: DataTableCell,
  paragraph: Paragraph,
  dialog: DialogCell,
  block: BlockCell,
  node: NodeCell,
  pdfViewer: PDFViewerCell,
  readOnlyDetails: ReadOnlyDetailsCell,
  image: ImageCell,
  editableDetails: EditableDetailsV2Cell,
};

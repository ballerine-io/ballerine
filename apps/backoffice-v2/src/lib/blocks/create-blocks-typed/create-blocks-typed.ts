import { CellsMap, createBlocks } from '@ballerine/blocks';
import { BlockCell } from '@/lib/blocks/components/BlockCell/BlockCell';
import { TCell } from '@/lib/blocks/create-blocks-typed/types';
import { FaceComparison } from '@/lib/blocks/components/FaceComparison/FaceComparison';
import { Details } from '@/lib/blocks/components/Details/Details';
import { NestedDetails } from '@/lib/blocks/components/NestedDetails/NestedDetails';
import { MultiDocuments } from '@/lib/blocks/components/MultiDocuments/MultiDocuments';
import { MapCell } from '@/lib/blocks/components/MapCell/MapCell';
import { CaseCallToActionLegacy } from '@/lib/blocks/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { Paragraph } from '@/lib/blocks/components/Paragraph/Paragraph';
import { DialogCell } from '@/lib/blocks/components/DialogCell/DialogCell';
import { Heading } from '@/lib/blocks/components/Heading/Heading';
import { Subheading } from '@/lib/blocks/components/Subheading/Subheading';
import { Alert } from '@/common/components/atoms/Alert/Alert';
import { BadgeCell } from '@/lib/blocks/components/BadgeCell/BadgeCell';
import { Container } from '@/lib/blocks/components/Container/Container';
import { CallToActionLegacy } from '@/lib/blocks/components/CallToActionLegacy/CallToActionLegacy';
import { CallToAction } from '@/lib/blocks/components/CallToAction/CallToAction';
import { TableCell } from '@/lib/blocks/components/TableCell/TableCell';

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
  paragraph: Paragraph,
  dialog: DialogCell,
  block: BlockCell,
};

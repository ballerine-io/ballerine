import { Block, CellsMap, createBlocks } from '@ballerine/blocks';
import { Heading } from '@/pages/Entity/components/Heading/Heading';
import { Subheading } from '@/pages/Entity/components/Subheading/Subheading';
import { Alert } from '@/pages/Entity/components/Alert/Alert';
import { BadgeCell } from '@/pages/Entity/components/BadgeCell/BadgeCell';
import { Container } from '@/pages/Entity/components/Container/Container';
import { CallToActionLegacy } from '@/pages/Entity/components/CallToActionLegacy/CallToActionLegacy';
import { CallToAction } from '@/pages/Entity/components/CallToAction/CallToAction';
import { DirectorsCallToAction } from '@/pages/Entity/components/DirectorsCallToAction';
import { FaceComparison } from '@/pages/Entity/components/FaceComparison/FaceComparison';
import { Details } from '@/pages/Entity/components/Details/Details';
import { NestedDetails } from '@/pages/Entity/components/NestedDetails/NestedDetails';
import { MultiDocuments } from '@/pages/Entity/components/MultiDocuments/MultiDocuments';
import { MapCell } from '@/pages/Entity/components/MapCell/MapCell';
import { CaseCallToActionLegacy } from '@/pages/Entity/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { TableCell } from '@/pages/Entity/components/TableCell/TableCell';
import { Paragraph } from '@/pages/Entity/components/Paragraph/Paragraph';
import { DialogCell } from '@/pages/Entity/components/DialogCell/DialogCell';
import { BlockCell } from '@/pages/Entity/components/BlockCell/BlockCell';

export type TCell =
  | {
      type: 'block';
      props?: {
        className?: string;
      };
      value: Block;
    }
  | {
      type: 'container';
      value: Block;
    };

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
  directorsCallToAction: DirectorsCallToAction,
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

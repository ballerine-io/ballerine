import { BadgeCell } from '@/lib/blocks/components/BadgeCell/BadgeCell';
import { CallToActionLegacy } from '@/lib/blocks/components/CallToActionLegacy/CallToActionLegacy';
import { CallToAction } from '@/lib/blocks/components/CallToAction/CallToAction';
import { DirectorsCallToAction } from '@/lib/blocks/components/DirectorsCallToAction';
import { FaceComparison } from '@/lib/blocks/components/FaceComparison/FaceComparison';
import { Details } from '@/lib/blocks/components/Details/Details';
import { MultiDocuments } from '@/lib/blocks/components/MultiDocuments/MultiDocuments';
import { MapCell } from '@/lib/blocks/components/MapCell/MapCell';
import { CaseCallToActionLegacy } from '@/lib/blocks/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { Paragraph } from '@/lib/blocks/components/Paragraph/Paragraph';
import { DialogCell } from '@/lib/blocks/components/DialogCell/DialogCell';
import { NestedDetails } from '@/lib/blocks/components/NestedDetails/NestedDetails';
import { Container } from '@/lib/blocks/components/Container/Container';
import { Alert } from '@/lib/blocks/components/Alert/Alert';
import { Heading } from '@/lib/blocks/components/Heading/Heading';
import { Subheading } from '@/lib/blocks/components/Subheading/Subheading';
import { TableCell } from '@/lib/blocks/components/TableCell/TableCell';

export const cells = {
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
};

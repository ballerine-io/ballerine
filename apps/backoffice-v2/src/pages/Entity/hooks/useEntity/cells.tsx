import { Alert } from '../../components/Alert/Alert';
import { BadgeCell } from '../../components/BadgeCell/BadgeCell';
import { CallToActionLegacy } from '@/pages/Entity/components/CallToActionLegacy/CallToActionLegacy';
import { CaseCallToActionLegacy } from '@/pages/Entity/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { Container } from '../../components/Container/Container';
import { Details } from '../../components/Details/Details';
import { FaceComparison } from '../../components/FaceComparison/FaceComparison';
import { Heading } from '../../components/Heading/Heading';
import { MapCell } from '../../components/MapCell/MapCell';
import { MultiDocuments } from '../../components/MultiDocuments/MultiDocuments';
import { NestedDetails } from '../../components/NestedDetails/NestedDetails';
import { Paragraph } from '../../components/Paragraph/Paragraph';
import { Subheading } from '../../components/Subheading/Subheading';
import { TableCell } from '../../components/TableCell/TableCell';
import { DialogCell } from '@/pages/Entity/components/DialogCell/DialogCell';
import { CallToAction } from '@/pages/Entity/components/CallToAction/CallToAction';

export const cells = {
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
};

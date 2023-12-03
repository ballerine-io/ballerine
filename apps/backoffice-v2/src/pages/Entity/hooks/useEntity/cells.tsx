import { Alert } from '../../components/Alert/Alert';
import { BadgeCell } from '../../components/BadgeCell/BadgeCell';
import { CallToAction } from '../../components/CallToAction/CallToAction';
import { CaseCallToAction } from '../../components/CaseCallToAction/CaseCallToAction';
import { Container } from '../../components/Container/Container';
import { Details } from '../../components/Details/Details';
import { DirectorsCallToAction } from '../../components/DirectorsCallToAction';
import { FaceComparison } from '../../components/FaceComparison/FaceComparison';
import { Heading } from '../../components/Heading/Heading';
import { MapCell } from '../../components/MapCell/MapCell';
import { MultiDocuments } from '../../components/MultiDocuments/MultiDocuments';
import { NestedDetails } from '../../components/NestedDetails/NestedDetails';
import { Paragraph } from '../../components/Paragraph/Paragraph';
import { Subheading } from '../../components/Subheading/Subheading';
import { TableCell } from '../../components/TableCell/TableCell';

export const cells = {
  heading: Heading,
  subheading: Subheading,
  alert: Alert,
  badge: BadgeCell,
  container: Container,
  callToAction: CallToAction,
  directorsCallToAction: DirectorsCallToAction,
  faceComparison: FaceComparison,
  details: Details,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocuments,
  map: MapCell,
  caseCallToAction: CaseCallToAction,
  table: TableCell,
  paragraph: Paragraph,
};

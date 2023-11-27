import { Heading } from '../../components/Heading/Heading';
import { Subheading } from '../../components/Subheading/Subheading';
import { Alert } from '../../components/Alert/Alert';
import { Container } from '../../components/Container/Container';
import { CallToAction } from '../../components/CallToAction/CallToAction';
import { FaceComparison } from '../../components/FaceComparison/FaceComparison';
import { Details } from '../../components/Details/Details';
import { MultiDocuments } from '../../components/MultiDocuments/MultiDocuments';
import { NestedDetails } from '../../components/NestedDetails/NestedDetails';
import { MapCell } from '../../components/MapCell/MapCell';
import { CaseCallToAction } from '../../components/CaseCallToAction/CaseCallToAction';
import { BadgeCell } from '../../components/BadgeCell/BadgeCell';
import { TableCell } from '../../components/TableCell/TableCell';
import { Paragraph } from '../../components/Paragraph/Paragraph';
import { DownloadFile } from '../../components/DownloadFile/DownloadFile';

export const cells = {
  heading: Heading,
  subheading: Subheading,
  alert: Alert,
  badge: BadgeCell,
  container: Container,
  callToAction: CallToAction,
  faceComparison: FaceComparison,
  details: Details,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocuments,
  map: MapCell,
  caseCallToAction: CaseCallToAction,
  table: TableCell,
  paragraph: Paragraph,
  downloadFile: DownloadFile,
};

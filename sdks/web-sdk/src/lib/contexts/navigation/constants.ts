import { Steps } from '../configuration';
import {
  CheckDocument,
  CheckDocumentPhotoBack,
  CheckSelfie,
  Decline,
  DocumentPhoto,
  DocumentPhotoBack,
  DocumentPhotoBackStart,
  DocumentSelection,
  DocumentStart,
  ErrorPage,
  Final,
  Loading,
  Resubmission,
  Selfie,
  SelfieStart,
  Welcome,
} from '../../pages';

export const steps = [
  { name: Steps.Welcome, component: Welcome },
  { name: Steps.DocumentSelection, component: DocumentSelection },
  { name: Steps.DocumentStart, component: DocumentStart },
  { name: Steps.DocumentPhoto, component: DocumentPhoto },
  { name: Steps.CheckDocument, component: CheckDocument },
  {
    name: Steps.DocumentPhotoBackStart,
    component: DocumentPhotoBackStart,
    type: 'back-side',
  },
  {
    name: Steps.DocumentPhotoBack,
    component: DocumentPhotoBack,
    type: 'back-side',
  },
  {
    name: Steps.CheckDocumentPhotoBack,
    component: CheckDocumentPhotoBack,
    type: 'back-side',
  },
  { name: Steps.SelfieStart, component: SelfieStart },
  { name: Steps.Selfie, component: Selfie },
  { name: Steps.CheckSelfie, component: CheckSelfie },
  { name: Steps.Loading, component: Loading },
  {
    name: Steps.Resubmission,
    component: Resubmission,
    type: 'no-flow-part',
  },
  { name: Steps.Decline, component: Decline, type: 'no-flow-part' },
  { name: Steps.Error, component: ErrorPage, type: 'no-flow-part' },
  { name: Steps.Final, component: Final, type: 'no-flow-part' },
];

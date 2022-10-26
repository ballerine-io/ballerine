import { Steps } from '../configuration';
import {
  Welcome,
  DocumentSelection,
  DocumentStart,
  DocumentPhoto,
  CheckDocument,
  DocumentPhotoBack,
  CheckDocumentPhotoBack,
  SelfieStart,
  Selfie,
  CheckSelfie,
  Final,
  DocumentPhotoBackStart,
  Loading,
  Resubmission,
  Decline,
  ErrorPage,
} from '../../pages';
import { IStep } from './types';

export const steps = [
  { name: Steps.Welcome, route: '/', component: Welcome },
  { name: Steps.DocumentSelection, route: '/select-document', component: DocumentSelection },
  { name: Steps.DocumentStart, route: '/document-start', component: DocumentStart },
  { name: Steps.DocumentPhoto, route: '/document-photo', component: DocumentPhoto },
  { name: Steps.CheckDocument, route: '/check-document', component: CheckDocument },
  {
    name: Steps.DocumentPhotoBackStart,
    route: '/document-photo-back-start',
    component: DocumentPhotoBackStart,
    type: 'back-side',
  },
  {
    name: Steps.DocumentPhotoBack,
    route: '/document-photo-back',
    component: DocumentPhotoBack,
    type: 'back-side',
  },
  {
    name: Steps.CheckDocumentPhotoBack,
    route: '/check-document-photo-back',
    component: CheckDocumentPhotoBack,
    type: 'back-side',
  },
  { name: Steps.SelfieStart, route: '/selfie-start', component: SelfieStart },
  { name: Steps.Selfie, route: '/selfie', component: Selfie },
  { name: Steps.CheckSelfie, route: '/check-selfie', component: CheckSelfie },
  { name: Steps.Loading, route: '/loading', component: Loading },
  {
    name: Steps.Resubmission,
    route: '/resubmission',
    component: Resubmission,
    type: 'no-flow-part',
  },
  { name: Steps.Decline, route: '/decline', component: Decline, type: 'no-flow-part' },
  { name: Steps.Error, route: '/error', component: ErrorPage, type: 'no-flow-part' },
  { name: Steps.Final, route: '/final', component: Final, type: 'no-flow-part' },
];

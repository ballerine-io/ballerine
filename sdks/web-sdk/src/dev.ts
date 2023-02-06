import { Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { DocumentKind, DocumentType } from './lib/contexts/app-state';
import { FlowsInitOptions } from './types/BallerineSDK';

const ballerineInitConfig: FlowsInitOptions = {
  workflowConfig: {
    flows: {
      ['my-kyc-flow']: {
        context: {
          documents: [],
          selfie: undefined,
        },
        states: {
          [Steps.Welcome]: {
            type: 'ui-step',
          },
          [Steps.DocumentSelection]: {
            type: 'ui-step',
          },
          [Steps.DocumentPhoto]: {
            type: 'ui-step',
          },
          [Steps.CheckDocument]: {
            type: 'ui-step',
          },
          [Steps.DocumentPhotoBackStart]: {
            type: 'ui-step',
          },
          [Steps.DocumentPhotoBack]: {
            type: 'ui-step',
          },
          [Steps.CheckDocumentPhotoBack]: {
            type: 'ui-step',
          },
          [Steps.SelfieStart]: {
            type: 'ui-step',
          },
          [Steps.Selfie]: {
            type: 'ui-step',
          },
          [Steps.CheckSelfie]: {
            type: 'ui-step',
          },
          [Steps.Loading]: {
            type: 'ui-step',
          },
          [Steps.Final]: {
            type: 'ui-step',
          },
        },
      },
    },
  },
  endUserInfo: { id: 'test-id' },
  translations: {
    overrides: {},
  },
  uiConfig: {
    flows: {
      ['my-kyc-flow']: {
        steps: [
          {
            name: Steps.Welcome,
            id: Steps.Welcome,
          },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              { type: DocumentType.ID_CARD, kind: DocumentKind.ID_CARD },
              { type: DocumentType.DRIVERS_LICENSE, kind: DocumentKind.DRIVERS_LICENSE },
              { type: DocumentType.PASSPORT, kind: DocumentKind.PASSPORT },
              { type: DocumentType.VOTER_ID, kind: DocumentKind.VOTER_ID },
            ],
          },
          { name: Steps.DocumentPhoto, id: Steps.DocumentPhoto },
          { name: Steps.CheckDocument, id: Steps.CheckDocument },
          { name: Steps.DocumentPhotoBackStart, id: Steps.DocumentPhotoBackStart },
          { name: Steps.DocumentPhotoBack, id: Steps.DocumentPhotoBack },
          { name: Steps.CheckDocumentPhotoBack, id: Steps.CheckDocumentPhotoBack },
          { name: Steps.SelfieStart, id: Steps.SelfieStart },
          { name: Steps.Selfie, id: Steps.Selfie },
          { name: Steps.CheckSelfie, id: Steps.CheckSelfie },
          { name: Steps.Loading, id: Steps.Loading },
          { name: Steps.Final, id: Steps.Final },
        ],
      },
      ['my-kyb-flow']: {
        steps: [
          { name: Steps.Welcome, id: Steps.Welcome },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.CheckDocument,
            id: Steps.CheckDocument,
            type: DocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },
          {
            name: Steps.CheckDocument,
            id: Steps.CheckDocument,
            type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.CheckDocument,
            id: Steps.CheckDocument,
            type: DocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              { type: DocumentType.ID_CARD, kind: DocumentKind.ID_CARD },
              { type: DocumentType.DRIVERS_LICENSE, kind: DocumentKind.DRIVERS_LICENSE },
              { type: DocumentType.PASSPORT, kind: DocumentKind.PASSPORT },
              { type: DocumentType.VOTER_ID, kind: DocumentKind.VOTER_ID },
            ],
          },
          { name: Steps.DocumentPhoto, id: Steps.DocumentPhoto },
          { name: Steps.DocumentPhotoBackStart, id: Steps.DocumentPhotoBackStart },
          { name: Steps.DocumentPhotoBack, id: Steps.DocumentPhotoBack },
          { name: Steps.Loading, id: Steps.Loading },
          { name: Steps.Final, id: Steps.Final },
        ],
      },
    },
  },
};
console.log(ballerineInitConfig);

void flows.init(ballerineInitConfig).then(() => {
  void flows.mount({
    flowName: 'my-kyc-flow',
    useModal: true,
  });
});

import { DocumentKind, DocumentType } from './lib/contexts/app-state';
import { Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { FlowsInitOptions } from './types/BallerineSDK';

const ballerineInitConfig: FlowsInitOptions = {
  workflowConfig: {
    flows: {
      ['my-kyc-flow']: {
        workflowDefinitionType: 'statechart-json',
        workflowDefinition: {
          predictableActionArguments: true, // Ensures that assign actions are called in order
          id: 'kyc',
          initial: Steps.Welcome,

          context: {
            documents: [],
            selfie: undefined,
          },

          states: {
            [Steps.Welcome]: {
              on: {
                USER_NEXT_STEP: Steps.DocumentSelection,
              },
            },
            [Steps.DocumentSelection]: {
              on: {
                USER_NEXT_STEP: Steps.DocumentPhoto,
              },
            },
            [Steps.DocumentPhoto]: {
              on: {
                USER_NEXT_STEP: Steps.CheckDocument,
              },
            },
            [Steps.CheckDocument]: {
              on: {
                USER_NEXT_STEP: Steps.DocumentPhotoBackStart,
              },
            },
            [Steps.DocumentPhotoBackStart]: {
              on: {
                USER_NEXT_STEP: Steps.DocumentPhotoBack,
              },
            },
            [Steps.DocumentPhotoBack]: {
              on: {
                USER_NEXT_STEP: Steps.CheckDocumentPhotoBack,
              },
            },
            [Steps.CheckDocumentPhotoBack]: {
              on: {
                USER_NEXT_STEP: Steps.SelfieStart,
              },
            },
            [Steps.SelfieStart]: {
              on: {
                USER_NEXT_STEP: Steps.Selfie,
              },
            },
            [Steps.Selfie]: {
              on: {
                USER_NEXT_STEP: Steps.CheckSelfie,
              },
            },
            [Steps.CheckSelfie]: {
              on: {
                USER_NEXT_STEP: Steps.Loading,
              },
            },
            [Steps.Loading]: {
              on: {
                USER_NEXT_STEP: Steps.Final,
              },
            },
            [Steps.Final]: {
              on: {
                USER_NEXT_STEP: Steps.Welcome,
              },
            },
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
  metricsConfig: {
    enabled: true,
  },
};
console.log(ballerineInitConfig);

void flows.init(ballerineInitConfig).then(() => {
  void flows.mount({
    flowName: 'my-kyc-flow',
    useModal: true,
  });
});

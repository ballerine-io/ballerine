import { Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { EDocumentKind, EDocumentType } from './lib/contexts/app-state';
import { FlowsInitOptions } from './types/BallerineSDK';

const ballerineInitConfig: FlowsInitOptions = {
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
              { type: EDocumentType.ID_CARD, kind: EDocumentKind.ID_CARD },
              { type: EDocumentType.DRIVERS_LICENSE, kind: EDocumentKind.DRIVERS_LICENSE },
              { type: EDocumentType.PASSPORT, kind: EDocumentKind.PASSPORT },
              { type: EDocumentType.VOTER_ID, kind: EDocumentKind.VOTER_ID },
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
            type: EDocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: EDocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: EDocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: EDocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },

          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: EDocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: EDocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              { type: EDocumentType.ID_CARD, kind: EDocumentKind.ID_CARD },
              { type: EDocumentType.DRIVERS_LICENSE, kind: EDocumentKind.DRIVERS_LICENSE },
              { type: EDocumentType.PASSPORT, kind: EDocumentKind.PASSPORT },
              { type: EDocumentType.VOTER_ID, kind: EDocumentKind.VOTER_ID },
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

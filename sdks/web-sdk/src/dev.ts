import { Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { DocumentType } from './lib/contexts/app-state';
import { FlowsInitOptions } from './types/BallerineSDK';

const ballerineInitConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  translations: {
    overrides: {},
  },
  uiConfig: {

    general: {
      colors: {
        primary: 'blue',
      },
      fonts: {
        name: 'Inter',
        link: 'https://fonts.googleapis.com/css2?family=Inter:wght@500',
        weight: [500, 700],
      },
    },
    flows: {
      ['my-kyc-flow']: {
        steps: [
          { name: Steps.Welcome, id: Steps.Welcome },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              DocumentType.ID_CARD,
              DocumentType.DRIVERS_LICENSE,
              DocumentType.PASSPORT,
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
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              DocumentType.ID_CARD,
              DocumentType.DRIVERS_LICENSE,
              DocumentType.PASSPORT,
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
  flows.openModal('my-kyc-flow', {});
});

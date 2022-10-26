import { Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { DocumentType } from './lib/contexts/app-state';
import { FlowsInitOptions } from './types/BallerineSDK';

const ballerineInitConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  // backendConfig: {
  //   baseUrl: 'http://localhost:3001',
  // },
  uiConfig: {
    general: {
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
        ],
      },
    },
  },
};
console.log(ballerineInitConfig);
flows.init(ballerineInitConfig).then(() => {
  flows.openModal('my-kyc-flow', {});
});

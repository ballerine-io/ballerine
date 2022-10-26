import { IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { IAppConfiguration } from '../contexts/configuration';
import { Elements, ICSSProperties, IElement, Steps } from '../contexts/configuration/types';
import { DocumentType } from '../contexts/app-state';
import { DocumentVariant } from '../contexts/app-state/types';

// Config prioritiztion:
// 3. Theme configuration
// 2. Step configuration
// 1. Components configuration

const general = {
  progress: false,
  borderRadius: '16px',
  padding: '24px',
  themeColor: '#080444',
  colors: {
    primary: '#080444',
    secondary: '#080444',
    text: '#788597',
    danger: 'rgba(173, 0, 0, 0.8);',
  },
  fonts: {
    name: 'Inter',
    weight: [500, 700],
  },
};

const defaultFlowOrder = [
  Steps.Welcome,
  Steps.DocumentSelection,
  Steps.DocumentPhoto,
  Steps.CheckDocument,
  Steps.DocumentPhotoBackStart,
  Steps.DocumentPhotoBack,
  Steps.CheckDocumentPhotoBack,
  Steps.SelfieStart,
  Steps.Selfie,
  Steps.CheckSelfie,
  Steps.Loading,
];

export const configuration: IAppConfiguration = {
  backendConfig: {
    baseUrl: 'https://api-dev.ballerine.io',
    auth: {
      method: 'jwt',
      authorizationHeader:
        'Bearer ***PURGED-INCIDENT-2026-09***',
    },
    endpoints: {
      startVerification: '/v2/enduser/verify',
      getVerificationStatus: '/v2/enduser/verify/status/{verificationId}',
      processStepData: '/v2/enduser/verify/partial',
      getConfig: '/v2/clients/{clientId}/config',
    },
  },
  isDevelopment: false,
  defaultLanguage: 'en',
  endUserInfo: {
    id: 'test-id123',
  },
  general,
  flows: {
    default: {
      name: 'default',
      stepsOrder: defaultFlowOrder,
      syncFlow: true,
      useFinalQueryParams: true,
    },
  },
};

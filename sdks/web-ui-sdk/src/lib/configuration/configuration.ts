import { IAppConfiguration, Steps } from '../contexts/configuration';
import { IFlow } from '../contexts/flows';

// Config prioritiztion:
// 3. Theme configuration
// 2. Step configuration
// 1. Components configuration

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
    baseUrl: 'http://localhost:3000/api/v1',
    auth: {
      method: 'basic',
      authorizationHeader: `Bearer 12345678-1234-1234-1234-123456789012`,
    },
    endpoints: {
      startVerification: '/v2/enduser/verify',
      getVerificationStatus: '/v2/enduser/verify/status/{verificationId}',
      processStepData: '/v2/enduser/verify/partial',
      getConfig: '/v2/clients/{clientId}/config',
      uploadFile: '/collection-flow/files',
      updateContext: '/collection-flow/sync/context',
    },
  },
  isDevelopment: false,
  defaultLanguage: 'en',
  endUserInfo: {
    id: 'test-id123',
  },
  flows: {
    default: {
      name: 'default',
      stepsOrder: defaultFlowOrder,
      syncFlow: true,
      useFinalQueryParams: true,
    } as IFlow,
  },
  metricsConfig: {
    enabled: true,
  },
};

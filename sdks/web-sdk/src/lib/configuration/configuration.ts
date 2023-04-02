import { IAppConfiguration } from '../contexts/configuration';

// Config prioritiztion:
// 3. Theme configuration
// 2. Step configuration
// 1. Components configuration

export const configuration: IAppConfiguration = {
  backendConfig: {
    baseUrl: 'https://api-dev.ballerine.io',
    auth: {
      method: 'jwt',
      authorizationHeader:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmRVc2VySWQiOiJhMzE5Yzk1ZC03ODY4LTQyNDAtOTQ5YS1mMDRmNDEwMzRlYzEiLCJjbGllbnRJZCI6IjJlOGJiZTJjLTJhYjktNGRkZi1iOWI5LTZlZWM5M2Q3YjQzMSIsImlhdCI6MTY1OTM1NDAwNywiZXhwIjoxODczODcyOTU4Njc0MTM4OCwiaXNzIjoiMmU4YmJlMmMtMmFiOS00ZGRmLWI5YjktNmVlYzkzZDdiNDMxIn0.aEaz4y7pBYG6Ia1Yb74cUOp0E0UsgtCItgLd2EXjo3U',
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
  flows: {
    default: {
      // TODO: fix this
      // name: 'default',
      // stepsOrder: defaultFlowOrder,
      // syncFlow: true,
      // useFinalQueryParams: true,
    },
  },
  metricsConfig: {
    enabled: true,
  },
};

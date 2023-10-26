import { StateTag } from '@ballerine/common';

export const kycEmailSessionDefinition = {
  id: 'kyc_email_session_example',
  name: 'kyc_email_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_email_session_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    states: {
      idle: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          start: 'email_sent',
        },
      },
      email_sent: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      kyc_manual_review: {},
    },
  },
  config: {
    callbackResult: {
      transformers: [
        {
          transformer: 'jmespath',
          mapping: '{data: @}', // jmespath
        },
      ],
      deliverEvent: 'KYC_DONE',
    },
  },
};

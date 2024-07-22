import { SerializableValidatableTransformer } from './../external-plugin/types';

export const SANCSIONS_SCREENING_VENDOR = {
  'dow-jones': 'dow-jones',
  'comply-advantage': 'comply-advantage',
  'asia-verify': 'asia-verify',
} as const;

export type SancsionsScreeningVendors =
  (typeof SANCSIONS_SCREENING_VENDOR)[keyof typeof SANCSIONS_SCREENING_VENDOR];

export const SANCSIONS_SCREENING_BASE_RESPONSE = {
  transform: [
    {
      mapping:
        "merge({ name: 'company_sanctions', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'SUCCESS' }, @)",
      transformer: 'jmespath',
    },
    {
      mapping: [
        {
          method: 'setTimeToRecordUTC',
          source: 'invokedAt',
          target: 'invokedAt',
        },
      ],
      transformer: 'helper',
    },
  ],
} as SerializableValidatableTransformer;

export const SANCSIONS_SCREENING = {
  [SANCSIONS_SCREENING_VENDOR['dow-jones']]: {
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
                            vendor: 'dow-jones',
                            endUserId: join('__', [entity.ballerineEntityId, '']),
                            firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,
                            lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,
                            dateOfBirth: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.dateOfBirth,
                            ongoingMonitoring: false,
                            clientId: clientId,
                            callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/AML_RESPONSE_RECEIVED','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api'])
                          }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  },
  [SANCSIONS_SCREENING_VENDOR['comply-advantage']]: {
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
                  vendor: 'veriff',
                  endUserId: join('__', [entity.ballerineEntityId, '']),
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  dateOfBirth: entity.data.dateOfBirth,
                  ongoingMonitoring: ongoingMonitoring,
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/RESPONSE_RECEIVED','?resultDestination=aml&processName=aml-unified-api'])
                }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  },
  [SANCSIONS_SCREENING_VENDOR['asia-verify']]: {
    request: undefined,
    response: undefined,
  },
} as const satisfies Record<SancsionsScreeningVendors, any>;

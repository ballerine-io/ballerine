import { SerializableValidatableTransformer } from './../external-plugin/types';

export const SANCTIONS_SCREENING_VENDOR = {
  'dow-jones': 'dow-jones',
  'comply-advantage': 'comply-advantage',
  'asia-verify': 'asia-verify',
} as const;

export type SancsionsScreeningVendors =
  (typeof SANCTIONS_SCREENING_VENDOR)[keyof typeof SANCTIONS_SCREENING_VENDOR];

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
  [SANCTIONS_SCREENING_VENDOR['dow-jones']]: (successAction: string) => ({
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
                            vendor: 'dow-jones',
                            dateOfBirth: '1990-01-01'
                            ongoingMonitoring: false,
                            endUserId: join('__', [entity.ballerineEntityId, '']),
                            firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,
                            lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,
                            clientId: clientId,
                            callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/${successAction}','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api'])
                          }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  }),
  [SANCTIONS_SCREENING_VENDOR['comply-advantage']]: (successAction: string) => ({
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
                  vendor: 'veriff',
                  dateOfBirth: '1990-01-01'
                  ongoingMonitoring: false,
                  endUserId: join('__', [entity.ballerineEntityId, '']),
                  firstName: entity.data.additionalInfo.ubos[0].firstName,
                  lastName: entity.data.additionalInfo.ubos[0].lastName,
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/${successAction}','?resultDestination=aml&processName=aml-unified-api'])
                }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  }),
  [SANCTIONS_SCREENING_VENDOR['asia-verify']]: (successAction: string) => ({
    request: undefined,
    response: undefined,
  }),
} as const satisfies Record<SancsionsScreeningVendors, any>;

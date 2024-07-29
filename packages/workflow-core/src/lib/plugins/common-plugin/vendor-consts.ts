import { SerializableValidatableTransformer } from './../external-plugin/types';

export const SANCTIONS_SCREENING_VENDOR = {
  'dow-jones': 'dow-jones',
  'comply-advantage': 'comply-advantage',
  'asia-verify': 'asia-verify',
} as const;

export const BALLERINE_API_PLUGINS = {
  ...SANCTIONS_SCREENING_VENDOR,
  'company-sanctions': 'company-sanctions',
  ubo: 'ubo',
  kyb: 'kyb',
} as const satisfies Record<string, string>;

export type ApiBallerinePlugins =
  (typeof BALLERINE_API_PLUGINS)[keyof typeof BALLERINE_API_PLUGINS];

export const BALLERINE_API_PLUGINS_KINDS = Object.values(BALLERINE_API_PLUGINS);

export type SancsionsScreeningVendors =
  (typeof SANCTIONS_SCREENING_VENDOR)[keyof typeof SANCTIONS_SCREENING_VENDOR];

export type ApiBallerinePlugin = {
  url: string;
  displayName: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  headers: HeadersInit;
  persistResponseDestination?: string;
  request: SerializableValidatableTransformer;
  response: SerializableValidatableTransformer;
};

type ApiPluginOptionsBase = {
  pluginKind: ApiBallerinePlugins;
};

type DowJonesOptions = {
  pluginKind: 'dow-jones';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
};

type ComplyAdvantageOptions = {
  pluginKind: 'comply-advantage';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
};

type AsiaVerifyOptions = {
  pluginKind: 'asia-verify';
  successAction: string;
  takeEntityDetailFromKyc: boolean;
};

type CompanySanctionsOptions = {
  pluginKind: 'company-sanctions';
};

type UboOptions = {
  pluginKind: 'ubo';
};

type KybOptions = {
  pluginKind: 'kyb';
};

type ApiPluginOptions = DowJonesOptions &
  ComplyAdvantageOptions &
  AsiaVerifyOptions &
  CompanySanctionsOptions &
  UboOptions &
  KybOptions;

export const SANCSIONS_SCREENING_BASE_RESPONSE = {
  transform: [
    {
      mapping:
        "merge({ name: 'sanctions_screening', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'IN_PROGRESS' }, @)",
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

const BASE_SANCSIONS_SCREENING_OPTIONS = {
  url: '{secret.UNIFIED_API_URL}/aml-sessions',
  headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
  method: 'POST' as const,
  displayName: 'Sanctions Screening',
};

const getKycEntityMapping = (takeEntityDetailFromKyc: boolean) => {
  return takeEntityDetailFromKyc
    ? `
    firstName: entity.data.additionalInfo.ubos[0].firstName,
    lastName: entity.data.additionalInfo.ubos[0].lastName,`
    : `firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,
    lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,`;
};

export const BALLERINE_API_PLUGIN_FACTORY = {
  [BALLERINE_API_PLUGINS['dow-jones']]: (options: DowJonesOptions) => ({
    ...BASE_SANCSIONS_SCREENING_OPTIONS,
    pluginKind: 'dow-jones',
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
              vendor: 'dow-jones',
              dateOfBirth: '1990-01-01'
              ongoingMonitoring: false,
              endUserId: join('__', [entity.ballerineEntityId, '']),
              ${getKycEntityMapping(options.takeEntityDetailFromKyc)}
              clientId: clientId,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/${
                options.successAction
              }','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api'])
            }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  }),
  [BALLERINE_API_PLUGINS['comply-advantage']]: (options: ComplyAdvantageOptions) => ({
    ...BASE_SANCSIONS_SCREENING_OPTIONS,
    pluginKind: 'comply-advantage',
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
                  vendor: 'veriff',
                  dateOfBirth: '1990-01-01'
                  ongoingMonitoring: false,
                  endUserId: join('__', [entity.ballerineEntityId, '']),
                  ${getKycEntityMapping(options.takeEntityDetailFromKyc)}
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/${
                    options.successAction
                  }','?resultDestination=aml&processName=aml-unified-api'])
                }`, // jmespath
        },
      ],
    },
    response: SANCSIONS_SCREENING_BASE_RESPONSE,
  }),
  [BALLERINE_API_PLUGINS['asia-verify']]: (options: ApiPluginOptions) =>
    ({
      ...BASE_SANCSIONS_SCREENING_OPTIONS,
      pluginKind: 'asia-verify',
      request: undefined,
      response: undefined,
    } as any), // TODO: Implement
  [BALLERINE_API_PLUGINS['company-sanctions']]: (options: ApiPluginOptions) => ({
    pluginKind: 'company-sanctions',
    url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.companyName}/sanctions`,
    headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
    method: 'GET' as const,
    displayName: 'Company Sanctions',
    persistResponseDestination: 'pluginsOutput.companySanctions',
    request: {
      transform: [
        {
          mapping: "{ vendor: 'asia-verify' }",
          transformer: 'jmespath',
        },
      ],
    },
    response: {
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
    },
  }),
  [BALLERINE_API_PLUGINS['ubo']]: (options: UboOptions) => ({
    name: 'ubo',
    pluginKind: 'ubo',
    displayName: 'UBO Check',
    url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.registrationNumber}/ubo`,
    method: 'GET',
    persistResponseDestination: 'pluginsOutput.ubo',
    headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
            vendor: 'asia-verify',
            callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.ubo.data&processName=ubo-unified-api'])
          }`, // jmespath
        },
      ],
    },
    response: {
      transform: [
        {
          mapping:
            "merge({ name: 'ubo', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'IN_PROGRESS' }, @)",
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
    },
  }),
  [BALLERINE_API_PLUGINS['kyb']]: (options: KybOptions) => ({
    name: 'kyb',
    displayName: 'Registry Verification',
    pluginKind: 'kyb',
    url: `{secret.UNIFIED_API_URL}/companies-v2/{entity.data.country}/{entity.data.registrationNumber}`,
    method: 'GET',
    persistResponseDestination: 'pluginsOutput.businessInformation',
    headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `merge(
            { vendor: 'asia-verify' },
            entity.data.country == 'HK' && {
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.businessInformation.data&processName=kyb-unified-api'])
            }
          )`, // jmespath
        },
      ],
    },
    response: {
      transform: [
        {
          mapping:
            "merge({ name: 'kyb', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || jurisdictionCode == 'HK' && 'IN_PROGRESS' || 'SUCCESS' }, @)",
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
    },
  }),
} as const satisfies Record<
  ApiBallerinePlugins,
  {
    (options: ApiPluginOptions): ApiBallerinePlugin;
  }
>;

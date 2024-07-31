import { SerializableValidatableTransformer } from './../external-plugin/types';

export const INDIVIDUAL_SCREENING_VENDORS = {
  'dow-jones': 'dow-jones',
  'comply-advantage': 'comply-advantage',
} as const;

export const COMPANY_SCREENING_VENDORS = {
  'asia-verify': 'asia-verify',
} as const;

export const UBO_VENDORS = {
  'asia-verify': 'asia-verify',
} as const;

export type ApiIndividualScreeningVendors =
  (typeof INDIVIDUAL_SCREENING_VENDORS)[keyof typeof INDIVIDUAL_SCREENING_VENDORS];

export type ApiCompanyScreeningVendors =
  (typeof COMPANY_SCREENING_VENDORS)[keyof typeof COMPANY_SCREENING_VENDORS];

export type ApiUboVendors = (typeof UBO_VENDORS)[keyof typeof UBO_VENDORS];

export const BALLERINE_API_PLUGINS = {
  'individual-sanctions': 'individual-sanctions',
  'company-sanctions': 'company-sanctions',
  ubo: 'ubo',
  'resubmission-email': 'resubmission-email',
  'session-email': 'session-email',
  'invitation-email': 'invitation-email',
} as const satisfies Record<string, string>;

type PluginFactoryFnHelper<TPluginKind extends ApiPluginOptions['pluginKind'] | string> = (
  options: TPluginKind extends ApiPluginOptions['pluginKind']
    ? Extract<ApiPluginOptions, TPluginKind>
    : { pluginKind: TPluginKind },
) => ApiBallerinePlugin;

type PluginVendorFnHelper<
  TPluginKind extends ApiPluginOptions['pluginKind'] | string,
  TVendor extends Extract<ApiPluginOptions, { vendor: string }>['vendor'],
> = (
  options: Extract<ApiPluginOptions, { vendor: TVendor; pluginKind: TPluginKind }>,
) => ApiBallerinePlugin;

export type ApiBallerinePlugins =
  (typeof BALLERINE_API_PLUGINS)[keyof typeof BALLERINE_API_PLUGINS];

export const BALLERINE_API_PLUGINS_KINDS = Object.values(BALLERINE_API_PLUGINS);

export type ApiBallerinePlugin = {
  url: string;
  displayName?: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  headers: HeadersInit;
  persistResponseDestination?: string;
  request: SerializableValidatableTransformer;
  response: SerializableValidatableTransformer;
};

type DowJonesOptions = {
  pluginKind: 'individual-sanctions';
  vendor: 'dow-jones';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
};

type ComplyAdvantageOptions = {
  pluginKind: 'individual-sanctions';
  vendor: 'comply-advantage';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
};

type AsiaVerifyOptions = {
  pluginKind: 'individual-sanctions';
  vendor: 'asia-verify';
  successAction: string;
  takeEntityDetailFromKyc: boolean;
};

type CompanySanctionsAsiaVerifyOptions = {
  pluginKind: 'company-sanctions';
  vendor: 'asia-verify';
};

type UboAsiaVerifyOptions = {
  pluginKind: 'ubo';
  vendor: 'asia-verify';
};

type RegistryInformationAsiaVerifyOptions = {
  pluginKind: 'registry-information';
  vendor: 'asia-verify';
};

type ApiPluginOptions =
  | DowJonesOptions
  | ComplyAdvantageOptions
  | AsiaVerifyOptions
  | CompanySanctionsAsiaVerifyOptions
  | UboAsiaVerifyOptions
  | RegistryInformationAsiaVerifyOptions;

type TPluginFactory = {
  [TKey in Exclude<
    ApiBallerinePlugins,
    'individual-sanctions' | 'company-sanctions' | 'ubo'
  >]: PluginFactoryFnHelper<TKey>;
} & Record<
  'individual-sanctions',
  {
    [TKey in ApiIndividualScreeningVendors]: PluginVendorFnHelper<'individual-sanctions', TKey>;
  }
> &
  Record<
    'company-sanctions',
    {
      [TKey in ApiCompanyScreeningVendors]: PluginVendorFnHelper<'company-sanctions', TKey>;
    }
  > &
  Record<
    'ubo',
    {
      [TKey in ApiUboVendors]: PluginVendorFnHelper<'ubo', TKey>;
    }
  >;

const BASE_SANCSIONS_SCREENING_OPTIONS = {
  url: '{secret.UNIFIED_API_URL}/aml-sessions',
  headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
  method: 'POST' as const,
  displayName: 'Sanctions Screening',
};

const getKycEntityMapping = (takeEntityDetailFromKyc: boolean) => {
  return takeEntityDetailFromKyc
    ? `firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,
     lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,`
    : `firstName: entity.data.additionalInfo.ubos[0].firstName,
    lastName: entity.data.additionalInfo.ubos[0].lastName,`;
};

export const BALLERINE_API_PLUGIN_FACTORY = {
  [BALLERINE_API_PLUGINS['individual-sanctions']]: {
    [INDIVIDUAL_SCREENING_VENDORS['dow-jones']]: (options: DowJonesOptions) => ({
      ...BASE_SANCSIONS_SCREENING_OPTIONS,
      pluginKind: 'individual-sanctions',
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
      response: {
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
      } as SerializableValidatableTransformer,
    }),
    [INDIVIDUAL_SCREENING_VENDORS['comply-advantage']]: (options: ComplyAdvantageOptions) => ({
      ...BASE_SANCSIONS_SCREENING_OPTIONS,
      pluginKind: 'individual-sanctions',
      vendor: 'comply-advantage',
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
      response: {
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
      } as SerializableValidatableTransformer,
    }),
  },
  [BALLERINE_API_PLUGINS['company-sanctions']]: {
    [COMPANY_SCREENING_VENDORS['asia-verify']]: (options: ApiPluginOptions) => ({
      pluginKind: 'company-sanctions',
      vendor: 'asia-verify',
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
  },
  [BALLERINE_API_PLUGINS['ubo']]: {
    [UBO_VENDORS['asia-verify']]: _ => ({
      name: 'ubo',
      pluginKind: 'ubo',
      vendor: 'asia-verify',
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
  },
  [BALLERINE_API_PLUGINS['resubmission-email']]: _ => ({
    name: 'resubmission-email',
    pluginKind: 'resubmission-email',
    url: `{secret.EMAIL_API_URL}`,
    method: 'POST',
    successAction: 'EMAIL_SENT',
    errorAction: 'EMAIL_FAILURE',
    stateNames: ['pending_resubmission'],
    headers: {
      Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
      'Content-Type': 'application/json',
    },
    request: {
      transform: [
        {
          transformer: 'jmespath',
          // #TODO: create new token (new using old one)
          mapping: `{
            kybCompanyName: entity.data.companyName,
            customerCompanyName: metadata.customerName,
            firstName: entity.data.additionalInfo.mainRepresentative.firstName,
            resubmissionLink: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
            supportEmail: join('',['support@',metadata.customerName,'.com']),
            from: 'no-reply@ballerine.com',
            name: join(' ',[metadata.customerName,'Team']),
            receivers: [entity.data.additionalInfo.mainRepresentative.email],
            templateId: 'd-7305991b3e5840f9a14feec767ea7301',
            revisionReason: documents[].decision[].revisionReason | [0],
            language: workflowRuntimeConfig.language,
            adapter: '{secret.MAIL_ADAPTER}'
          }`, // TODO: figure out about adapter from env or secrets
        },
      ],
    },
    response: {
      transform: [],
    },
  }),
  [BALLERINE_API_PLUGINS['session-email']]: _ => ({
    name: 'session-email',
    pluginKind: 'session-email',
    url: `{secret.EMAIL_API_URL}`,
    method: 'POST',
    headers: {
      Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
      'Content-Type': 'application/json',
    },
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
        kybCompanyName: entity.data.additionalInfo.companyName,
        customerCompanyName: entity.data.additionalInfo.customerCompany,
        firstName: entity.data.firstName,
        kycLink: pluginsOutput.kyc_session.kyc_session_1.result.metadata.url,
        from: 'no-reply@ballerine.com',
        name: join(' ',[entity.data.additionalInfo.customerCompany,'Team']),
        receivers: [entity.data.email],
        subject: '{customerCompanyName} activation, Action needed.',
        templateId: (documents[].decision[].revisionReason | [0])!=null && 'd-2c6ae291d9df4f4a8770d6a4e272d803' || 'd-61c568cfa5b145b5916ff89790fe2065',
        revisionReason: documents[].decision[].revisionReason | [0],
        supportEmail: join('',['support@',entity.data.additionalInfo.customerCompany,'.com']),
        adapter: '{secret.MAIL_ADAPTER}'
        }`, // jmespath
        },
      ],
    },
    response: {
      transform: [],
    },
  }),

  [BALLERINE_API_PLUGINS['invitation-email']]: _ => ({
    name: 'invitation-email',
    pluginKind: 'invitation-email',
    url: `{secret.EMAIL_API_URL}`,
    method: 'POST',
    headers: {
      Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
      'Content-Type': 'application/json',
    },
    request: {
      transform: [
        {
          transformer: 'jmespath',
          mapping: `{
              templateId: 'd-00a0d5d14cb14fbb9034b53c6ef7e5fa',
              adapter: '{secret.MAIL_ADAPTER}'
              from: 'no-reply@ballerine.com',
              receivers: [mainRepresentative.email],
              name: mainRepresentative.fullName,
              provider: customerName,
              url: join('',['{secret.KYB_EXAMPLE_CORS_ORIGIN[0]}?token=',token])
          }`, // jmespath
        },
      ],
    },
    response: {
      transform: [],
    },
  }),
} satisfies TPluginFactory;
//  Record<ApiBallerinePlugins, PluginFactoryFn> |
// Record<'individual-sanctions', Record<ApiIndividualScreeningVendors, PluginFactoryFn>> |
// Record<'company-sanctions', Record<ApiCompanyScreeningVendors, PluginFactoryFn>>;

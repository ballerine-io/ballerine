import { IApiPluginParams, SerializableValidatableTransformer } from './types';

export const INDIVIDUAL_SCREENING_VENDORS = {
  'dow-jones': 'dow-jones',
  'comply-advantage': 'comply-advantage',
} as const;

export const COMPANY_SCREENING_VENDORS = {
  'asia-verify': 'asia-verify',
  test: 'test',
} as const;

export const KYC_VENDORS = {
  veriff: 'veriff',
} as const;

export const MERCHANT_MONITORING_VENDORS = {
  ballerine: 'ballerine',
} as const;

export const UBO_VENDORS = {
  'asia-verify': 'asia-verify',
  kyckr: 'kyckr',
  test: 'test',
} as const;

export const REGISTRY_INFORMATION_VENDORS = {
  'asia-verify': 'asia-verify',
  kyckr: 'kyckr',
  test: 'test',
} as const;

export const EMAIL_TEMPLATES = {
  resubmission: 'resubmission',
  session: 'session',
  invitation: 'invitation',
  'associated-company-email': 'associated-company-email',
} as const;

export type ApiIndividualScreeningVendors =
  (typeof INDIVIDUAL_SCREENING_VENDORS)[keyof typeof INDIVIDUAL_SCREENING_VENDORS];

export type ApiCompanyScreeningVendors =
  (typeof COMPANY_SCREENING_VENDORS)[keyof typeof COMPANY_SCREENING_VENDORS];

export type KycSessionVendors = (typeof KYC_VENDORS)[keyof typeof KYC_VENDORS];

export type MerchantMonitoringVendors =
  (typeof MERCHANT_MONITORING_VENDORS)[keyof typeof MERCHANT_MONITORING_VENDORS];

export type ApiUboVendors = (typeof UBO_VENDORS)[keyof typeof UBO_VENDORS];

export type ApiRegistryInformationVendors =
  (typeof REGISTRY_INFORMATION_VENDORS)[keyof typeof REGISTRY_INFORMATION_VENDORS];

export type ApiEmailTemplates = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

export const BALLERINE_API_PLUGINS = {
  'individual-sanctions': 'individual-sanctions',
  'company-sanctions': 'company-sanctions',
  ubo: 'ubo',
  'registry-information': 'registry-information',
  'template-email': 'template-email',
  'merchant-monitoring': 'merchant-monitoring',
  'kyc-session': 'kyc-session',
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

type PluginEmailFnHelper<
  TPluginKind extends ApiPluginOptions['pluginKind'] | string,
  TVendor extends Extract<ApiPluginOptions, { template: string }>['template'],
> = (
  options: Extract<ApiPluginOptions, { vendor: TVendor; pluginKind: TPluginKind }>,
) => ApiBallerinePlugin;

export type ApiBallerinePlugins =
  (typeof BALLERINE_API_PLUGINS)[keyof typeof BALLERINE_API_PLUGINS];

export const BALLERINE_API_PLUGINS_KINDS = Object.values(BALLERINE_API_PLUGINS);

export type ApiBallerinePlugin = {
  url: IApiPluginParams['url'];
  displayName?: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  headers: HeadersInit;
  persistResponseDestination?: string;
  request: SerializableValidatableTransformer;
  response: SerializableValidatableTransformer;
};

type EmailOptions = {
  pluginKind: 'template-email';
  template: ApiEmailTemplates;
  dataMapping?: string;
  templateId?: string;
};

type MerchantMonirotingOptions = {
  pluginKind: 'merchant-monitoring';
  vendor: MerchantMonitoringVendors;
  dataMapping?: string;
  merchantMonitoringQualityControl: boolean;
  reportType?:
    | 'MERCHANT_REPORT_T1'
    | 'MERCHANT_REPORT_T2'
    | 'ONGOING_MERCHANT_REPORT_T1'
    | 'ONGOING_MERCHANT_REPORT_T2';
};

type DowJonesOptions = {
  pluginKind: 'individual-sanctions';
  vendor: 'dow-jones';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
  dateOfBirth?: string;
  dataMapping?: string;
  ongoingMonitoring?: boolean;
};

type ComplyAdvantageOptions = {
  pluginKind: 'individual-sanctions';
  vendor: 'comply-advantage';
  takeEntityDetailFromKyc: boolean;
  successAction: string;
  dateOfBirth?: string;
  dataMapping?: string;
  ongoingMonitoring?: boolean;
};

type KycSessionOptions = {
  pluginKind: 'kyc-session';
  vendor: 'veriff';
  errorAction: string;
  successAction: string;
  withAml?: boolean;
  dataMapping?: string;
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
  url: string;
  response?: 'async' | 'sync';
  defaultCountry?: string;
};

type UboAsiaVerifyOptions = {
  pluginKind: 'ubo';
  vendor: 'asia-verify';
  defaultCountry?: string;
};

type UboKyckrOptions = {
  pluginKind: 'ubo';
  vendor: 'kyckr';
  defaultCountry?: string;
};

type RegistryInformationAsiaVerifyOptions = {
  pluginKind: 'registry-information';
  vendor: 'asia-verify' | 'test';
  defaultCountry?: string;
};

type RegistryInformationKyckrOptions = {
  pluginKind: 'registry-information';
  vendor: 'kyckr';
  defaultCountry?: string;
};

type ApiPluginOptions =
  | DowJonesOptions
  | ComplyAdvantageOptions
  | AsiaVerifyOptions
  | CompanySanctionsAsiaVerifyOptions
  | UboAsiaVerifyOptions
  | UboKyckrOptions
  | RegistryInformationAsiaVerifyOptions
  | RegistryInformationKyckrOptions
  | MerchantMonirotingOptions
  | EmailOptions
  | KycSessionOptions;

type TPluginFactory = Record<
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
  > &
  Record<
    'template-email',
    {
      [TKey in ApiEmailTemplates]: PluginEmailFnHelper<'template-email', TKey>;
    }
  > &
  Record<
    'merchant-monitoring',
    {
      [TKey in MerchantMonitoringVendors]: PluginVendorFnHelper<'merchant-monitoring', TKey>;
    }
  > &
  Record<
    'kyc-session',
    {
      [TKey in KycSessionVendors]: PluginVendorFnHelper<'kyc-session', TKey>;
    }
  > &
  Record<
    'registry-information',
    {
      [TKey in ApiRegistryInformationVendors]: PluginVendorFnHelper<'registry-information', TKey>;
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
  [BALLERINE_API_PLUGINS['registry-information']]: {
    [REGISTRY_INFORMATION_VENDORS['test']]: (options: RegistryInformationAsiaVerifyOptions) => ({
      name: 'businessInformation',
      displayName: 'Registry Information',
      pluginKind: 'registry-information',
      vendor: 'test',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies-v2/{country}/{entity.data.registrationNumber}`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
      method: 'GET',
      persistResponseDestination: 'pluginsOutput.businessInformation',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `merge(
            { vendor: 'test' },
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
              "merge({ name: 'businessInformation', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || jurisdictionCode == 'HK' && 'IN_PROGRESS' || 'SUCCESS' }, @)",
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
    [REGISTRY_INFORMATION_VENDORS['asia-verify']]: (
      options: RegistryInformationAsiaVerifyOptions,
    ) => ({
      name: 'businessInformation',
      displayName: 'Registry Information',
      pluginKind: 'registry-information',
      vendor: 'asia-verify',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies-v2/{country}/{entity.data.registrationNumber}`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
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
              "merge({ name: 'businessInformation', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || jurisdictionCode == 'HK' && 'IN_PROGRESS' || 'SUCCESS' }, @)",
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
    [REGISTRY_INFORMATION_VENDORS['kyckr']]: (options: RegistryInformationKyckrOptions) => ({
      name: 'businessInformation',
      displayName: 'Registry Information',
      pluginKind: 'registry-information',
      vendor: 'kyckr',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies-v2/{country}/{entity.data.registrationNumber}`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
      method: 'GET',
      persistResponseDestination: 'pluginsOutput.businessInformation',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
              vendor: 'kyckr',
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.businessInformation.data&processName=kyb-unified-api'])
            }`, // jmespath
          },
        ],
      },
      response: {
        transform: [
          {
            mapping:
              "merge({ name: 'businessInformation', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || jurisdictionCode == 'HK' && 'IN_PROGRESS' || 'SUCCESS' }, @)",
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
  [BALLERINE_API_PLUGINS['individual-sanctions']]: {
    [INDIVIDUAL_SCREENING_VENDORS['dow-jones']]: (options: DowJonesOptions) => ({
      ...BASE_SANCSIONS_SCREENING_OPTIONS,
      name: 'sanctionsScreening',
      pluginKind: 'individual-sanctions',
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
                vendor: 'dow-jones',
                ${getKycEntityMapping(options.takeEntityDetailFromKyc)}
                dateOfBirth: ${options.dateOfBirth ? `'${options.dateOfBirth}'` : '1990-01-01'}
                ongoingMonitoring: ${options.ongoingMonitoring || false ? 'true' : 'false'},
                endUserId: join('__', [entity.ballerineEntityId, '']),
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
              "merge({ name: 'sanctionsScreening', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'IN_PROGRESS' }, @)",
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
                    ${getKycEntityMapping(options.takeEntityDetailFromKyc)}
                    ${options.dataMapping || ''}
                    dateOfBirth: ${options.dateOfBirth ? `'${options.dateOfBirth}'` : '1990-01-01'}
                    ongoingMonitoring: ${options.ongoingMonitoring || false ? 'true' : 'false'},
                    endUserId: join('__', [entity.ballerineEntityId, '']),
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
    [COMPANY_SCREENING_VENDORS['asia-verify']]: (options: CompanySanctionsAsiaVerifyOptions) => ({
      name: 'companySanctions',
      pluginKind: 'company-sanctions',
      vendor: 'asia-verify',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies/{country}/{entity.data.companyName}/sanctions`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
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
              "merge({ name: 'companySanctions', status: contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], reason) && 'CANCELED' || error != `null` && 'ERROR' || 'SUCCESS'  }, @)",
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
    [COMPANY_SCREENING_VENDORS['test']]: (options: CompanySanctionsAsiaVerifyOptions) => ({
      name: 'companySanctions',
      pluginKind: 'company-sanctions',
      vendor: 'test',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies/{country}/{entity.data.companyName}/sanctions`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      method: 'GET' as const,
      displayName: 'Company Sanctions',
      persistResponseDestination: 'pluginsOutput.companySanctions',
      request: {
        transform: [
          {
            mapping: "{ vendor: 'test' }",
            transformer: 'jmespath',
          },
        ],
      },
      response: {
        transform: [
          {
            mapping:
              "merge({ name: 'companySanctions', status: contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], reason) && 'CANCELED' || error != `null` && 'ERROR' || 'SUCCESS'  }, @)",
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
  [BALLERINE_API_PLUGINS['merchant-monitoring']]: {
    [MERCHANT_MONITORING_VENDORS['ballerine']]: (options: MerchantMonirotingOptions) => ({
      name: 'merchantMonitoring',
      displayName: 'Merchant Monitoring',
      pluginKind: 'api',
      url: `{secret.UNIFIED_API_URL}/merchants/analysis`,
      method: 'POST',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      persistResponseDestination: 'pluginsOutput.merchantMonitoring',
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
              ${options.dataMapping || ''}
              reportType: '${options.reportType || 'MERCHANT_REPORT_T1'}',
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.merchantMonitoring&processName=website-monitoring'])
              withQualityControl: ${
                options.merchantMonitoringQualityControl ?? true ? 'true' : 'false'
              }
            }`, // jmespath
          },
        ],
      },
      response: {
        transform: [
          {
            mapping:
              "merge({ name: 'merchantMonitoring', status: contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], reason) && 'CANCELED' || error != `null` && 'ERROR' || 'IN_PROGRESS'  }, @)",
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
    [UBO_VENDORS['asia-verify']]: (options: UboAsiaVerifyOptions) => ({
      name: 'ubo',
      pluginKind: 'ubo',
      vendor: 'asia-verify',
      displayName: 'UBO Check',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies/{country}/{entity.data.registrationNumber}/ubo`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
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
    [UBO_VENDORS['test']]: (options: UboAsiaVerifyOptions) => ({
      name: 'ubo',
      pluginKind: 'ubo',
      vendor: 'test',
      displayName: 'UBO Check',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies/{country}/{entity.data.registrationNumber}/ubo`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
      method: 'GET',
      persistResponseDestination: 'pluginsOutput.ubo',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
              vendor: 'test',
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
    [UBO_VENDORS['kyckr']]: (options: UboKyckrOptions) => ({
      name: 'ubo',
      pluginKind: 'ubo',
      vendor: 'kyckr',
      displayName: 'UBO Check',
      url: {
        url: `{secret.UNIFIED_API_URL}/companies/{country}/{entity.data.registrationNumber}/ubo`,
        options: {
          country: options.defaultCountry ?? '{entity.data.country}',
        },
      },
      method: 'GET',
      persistResponseDestination: 'pluginsOutput.ubo',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
              vendor: 'kyckr',
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
  [BALLERINE_API_PLUGINS['template-email']]: {
    [EMAIL_TEMPLATES['associated-company-email']]: (options: EmailOptions) => ({
      name: 'associated_company_email',
      template: EMAIL_TEMPLATES['associated-company-email'],
      pluginKind: 'template-email',
      url: `{secret.EMAIL_API_URL}`,
      method: 'POST',
      stateNames: ['deliver_associated_company_email'],
      successAction: 'EMAIL_SENT',
      errorAction: 'EMAIL_FAILURE',
      headers: {
        Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
        'Content-Type': 'application/json',
      },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            // revision template id: d-90b00303f2654ea491a8e035fc4048c1
            mapping: `{
            companyName: entity.data.companyName,
            customerName: metadata.customerName,
            kybCompanyName: entity.data.additionalInfo.kybCompanyName,
            firstName: entity.data.additionalInfo.mainRepresentative.firstName,
            collectionFlowUrl: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token]),
            supportEmail: join('',['support@',metadata.customerName]),
            from: 'no-reply@ballerine.com',
            receivers: [entity.data.additionalInfo.mainRepresentative.email],
            templateId: ${
              options.templateId
                ? `'${options.templateId}'`
                : `'d-706793b7bef041ee86bf12cf0359e76d'`
            },
            adapter: '{secret.MAIL_ADAPTER}'
          }`, // jmespath
          },
        ],
      },
      response: {
        transform: [],
      },
    }),
    [EMAIL_TEMPLATES['resubmission']]: (options: EmailOptions) => ({
      name: 'resubmission',
      template: EMAIL_TEMPLATES['resubmission'],
      pluginKind: 'template-email',
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
              ${options.dataMapping || ''}
              kybCompanyName: entity.data.companyName,
              customerCompanyName: metadata.customerName,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              resubmissionLink: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
              supportEmail: join('',['support@',metadata.customerName,'.com']),
              from: 'no-reply@ballerine.com',
              name: join(' ',[metadata.customerName,'Team']),
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: ${
                options.templateId
                  ? `'${options.templateId}'`
                  : `'d-7305991b3e5840f9a14feec767ea7301'`
              },
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
    [EMAIL_TEMPLATES['session']]: (options: EmailOptions) => ({
      name: 'session',
      template: EMAIL_TEMPLATES['session'],
      pluginKind: 'template-email',
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
          ${options.dataMapping || ''}
          kybCompanyName: entity.data.additionalInfo.companyName,
          customerCompanyName: entity.data.additionalInfo.customerCompany,
          firstName: entity.data.firstName,
          kycLink: pluginsOutput.kyc_session.kyc_session_1.result.metadata.url,
          from: 'no-reply@ballerine.com',
          name: join(' ',[entity.data.additionalInfo.customerCompany,'Team']),
          receivers: [entity.data.email],
          subject: '{customerCompanyName} activation, Action needed.',
          templateId: ${
            options.templateId
              ? `'${options.templateId}'`
              : `(documents[].decision[].revisionReason | [0] != null) && 'd-2c6ae291d9df4f4a8770d6a4e272d803' || 'd-61c568cfa5b145b5916ff89790fe2065'`
          },
          revisionReason: documents[].decision[].revisionReason | [0],
          language: workflowRuntimeConfig.language,
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
    [EMAIL_TEMPLATES['invitation']]: (options: EmailOptions) => ({
      name: 'invitation',
      template: EMAIL_TEMPLATES['invitation'],
      pluginKind: 'invitation',
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
                    ${options.dataMapping || ''}
                    customerName: metadata.customerName,
                    collectionFlowUrl: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
                    from: 'no-reply@ballerine.com',
                    receivers: [entity.data.additionalInfo.mainRepresentative.email],
                    language: workflowRuntimeConfig.language,
                    templateId: ${
                      options.templateId
                        ? `'${options.templateId}'`
                        : `'d-8949519316074e03909042cfc5eb4f02'`
                    },
                    adapter: '{secret.MAIL_ADAPTER}'
            }`, // jmespath
          },
        ],
      },
      response: {
        transform: [],
      },
    }),
  },
  [BALLERINE_API_PLUGINS['kyc-session']]: {
    [KYC_VENDORS['veriff']]: (options: KycSessionOptions) => ({
      ...(options ?? {}),
      name: 'kyc_session',
      pluginKind: 'kyc-session',
      vendor: 'veriff',
      url: `{secret.UNIFIED_API_URL}/individual-verification-sessions`,
      method: 'POST',
      headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
      request: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: `{
              ${options.dataMapping || ''}
              endUserId: join('__',[entity.ballerineEntityId || entity.data.id || entity.data.identityNumber, pluginsOutput.kyc_session.kyc_session_1.result.metadata.id || '']),
              firstName: entity.data.firstName,
              lastName: entity.data.lastName,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/KYC_RESPONSE_RECEIVED','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result']),
              vendor: 'veriff',
              withAml: ${options.withAml ?? false ? 'true' : 'false'}
              }`, // jmespath
          },
        ],
      },
      response: {
        transform: [
          {
            transformer: 'jmespath',
            mapping: "{kyc_session_1: {vendor: 'veriff', type: 'kyc', result: {metadata: @}}}", // jmespath
          },
        ],
      },
    }),
  },
} satisfies TPluginFactory;
//  Record<ApiBallerinePlugins, PluginFactoryFn> |
// Record<'individual-sanctions', Record<ApiIndividualScreeningVendors, PluginFactoryFn>> |
// Record<'company-sanctions', Record<ApiCompanyScreeningVendors, PluginFactoryFn>>;

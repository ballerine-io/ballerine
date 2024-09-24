import { Customer } from '@prisma/client';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const FEATURE_LIST = {
  ONGOING_MERCHANT_REPORT_T1: 'ONGOING_MERCHANT_REPORT_T1',
} as const;

export type TCustomerFeatures = {
  name: keyof typeof FEATURE_LIST;
  enabled: boolean;
  options: TOngoingAuditReportDefinitionConfig;
};

export type TOngoingAuditReportDefinitionConfig = {
  intervalInDays: number;
  proxyViaCountry: string;
};

export const CUSTOMER_FEATURES = {
  [FEATURE_LIST.ONGOING_MERCHANT_REPORT_T1]: {
    name: 'ONGOING_MERCHANT_REPORT_T1',
    enabled: true, // show option in UI
    options: {
      intervalInDays: 30,
      proxyViaCountry: 'GB',
    },
  },
} satisfies Record<string, TCustomerFeatures>;

export type TCustomerWithDefinitionsFeatures = Customer & {
  features?: Record<string, TCustomerFeatures> | null;
};

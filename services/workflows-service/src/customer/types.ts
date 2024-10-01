import { Customer } from '@prisma/client';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const FEATURE_LIST = {
  ONGOING_MERCHANT_REPORT: 'ONGOING_MERCHANT_REPORT',
} as const;

export type TOngoingMerchantReportOptions = {
  runByDefault?: boolean;
  proxyViaCountry: string;
  workflowVersion: '1' | '2' | '3';
  reportType: 'ONGOING_MERCHANT_REPORT_T1';
} & (
  | {
      specificDates: {
        dayInMonth: number;
      };
    }
  | {
      intervalInDays: number;
    }
);

type FeaturesOptions = TOngoingMerchantReportOptions;

export type TCustomerFeatures = {
  enabled: boolean;
  options: FeaturesOptions;
};

export const CUSTOMER_FEATURES = {
  [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
    enabled: true,
    options: {
      intervalInDays: 30,
      runByDefault: true,
      workflowVersion: '2',
      proxyViaCountry: 'GB',
      reportType: 'ONGOING_MERCHANT_REPORT_T1',
    },
  },
} satisfies Record<string, TCustomerFeatures>;

export type TCustomerWithDefinitionsFeatures = Customer & {
  features?: Record<keyof typeof FEATURE_LIST, TCustomerFeatures> | null;
};

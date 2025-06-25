import { Customer } from '@prisma/client';
import { MerchantReportVersion } from '@ballerine/common';
import { TAccessDetails } from './schemas/zod-schemas';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const FEATURE_LIST = {
  ONGOING_MERCHANT_REPORT: 'ONGOING_MERCHANT_REPORT',
  WEBHOOK_QUEUE_SYSTEM_ENABLED: 'WEBHOOK_QUEUE_SYSTEM_ENABLED',
  DOCUMENT_OCR: 'isDocumentOcrEnabled',
  MOCK_DASHBOARD: 'mockDashboardV1',
} as const;

export type TOngoingMerchantReportOptions = {
  runByDefault?: boolean;
  proxyViaCountry: string;
  workflowVersion: MerchantReportVersion;
  reportType: 'ONGOING_MERCHANT_REPORT_T1';
  scheduleType: 'specific';
  dayInMonth: number;
  monthInterval: number;
};

type FeaturesOptions = TOngoingMerchantReportOptions;

export type TCustomerFeaturesConfig = {
  enabled: boolean;
  options: FeaturesOptions;
  disabledAt?: string;
};

export const CUSTOMER_FEATURES = {
  [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
    enabled: true,
    options: {
      scheduleType: 'specific',
      dayInMonth: 1,
      monthInterval: 1,
      runByDefault: true,
      workflowVersion: '2',
      proxyViaCountry: 'GB',
      reportType: 'ONGOING_MERCHANT_REPORT_T1',
    },
  },
} satisfies TCustomerWithFeatures['features'];

export type TCustomerWithFeatures = Customer & {
  features?: Partial<
    Record<(typeof FEATURE_LIST)[keyof typeof FEATURE_LIST], TCustomerFeaturesConfig>
  > | null;
};

export type TDemoCustomer = Omit<TCustomerWithFeatures, 'config'> & {
  config: { demoAccessDetails?: TAccessDetails };
};

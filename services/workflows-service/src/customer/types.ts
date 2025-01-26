import { Customer } from '@prisma/client';
import { MerchantReportVersion } from '@/business-report/constants';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const FEATURE_LIST = {
  ONGOING_MERCHANT_REPORT: 'ONGOING_MERCHANT_REPORT',
  DOCUMENT_OCR: 'isDocumentOcrEnabled',
} as const;

export type TOngoingMerchantReportOptions = {
  runByDefault?: boolean;
  proxyViaCountry: string;
  workflowVersion: MerchantReportVersion;
  reportType: 'ONGOING_MERCHANT_REPORT_T1';
} & (
  | {
      scheduleType: 'specific';
      specificDates: {
        dayInMonth: number;
      };
    }
  | {
      scheduleType: 'interval';
      intervalInDays: number;
    }
);

type FeaturesOptions = TOngoingMerchantReportOptions;

export type TCustomerFeaturesConfig = {
  name: keyof typeof FEATURE_LIST;
  enabled: boolean;
  options: FeaturesOptions;
};

export const CUSTOMER_FEATURES = {
  [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
    name: FEATURE_LIST.ONGOING_MERCHANT_REPORT,
    enabled: true,
    options: {
      scheduleType: 'interval',
      intervalInDays: 30,
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

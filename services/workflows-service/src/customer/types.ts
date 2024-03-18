import { Customer } from '@prisma/client';

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const CUSTOMER_FEATURES = {
  ONGOING_AUDIT_REPORT: {
    name: 'ONGOING_AUDIT_REPORT',
    definitionName: 'ongoing_audit_report',
  },
} as const;

export type TCustomerFeatures = {
  name: keyof typeof CUSTOMER_FEATURES;
  enabled: boolean;
  definitionName?: string;
};

export type TOngoingAuditReportDefinitionConfig = {
  definitionName: string;
  intervalInDays: number;
  active: boolean;
  checkType: string[];
  proxyViaCountry: string;
};

export type TCustomerWithDefinitionsFeatures = Partial<Customer> & {
  features?: TCustomerFeatures[] | null;
  definitionConfigs?: TOngoingAuditReportDefinitionConfig[] | null;
};

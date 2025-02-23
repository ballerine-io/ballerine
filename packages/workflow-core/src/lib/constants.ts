import { KycPlugin } from './plugins/external-plugin/kyc-plugin';
import { KycSessionPlugin } from './plugins/external-plugin/kyc-session-plugin';
import { KybPlugin } from './plugins/external-plugin/kyb-plugin';
import { ApiPlugin, WebhookPlugin } from './plugins';
import { EmailPlugin } from './plugins/external-plugin/email-plugin';
import { MastercardMerchantScreeningPlugin } from './plugins/external-plugin/mastercard-merchant-screening-plugin';
import { ObjectValues } from './types';
import { BALLERINE_API_PLUGINS } from './plugins/external-plugin/vendor-consts';
import { BallerineApiPlugin } from './plugins/external-plugin/ballerine-api-plugin';
import { BallerineEmailPlugin } from './plugins/external-plugin/ballerine-email-plugin';
import { IndividualsSanctionsV2Plugin } from './plugins/external-plugin/individuals-sanctions-v2-plugin/individuals-sanctions-v2-plugin';
import { BankAccountVerificationPlugin } from './plugins/external-plugin/bank-account-verification-plugin/bank-account-verification-plugin';
import { CommercialCreditCheckPlugin } from './plugins/external-plugin/commercial-credit-check-plugin/commercial-credit-check-plugin';

export const PluginKind = {
  KYC: 'kyc',
  KYB: 'kyb',
  WEBHOOK: 'webhook',
  API: 'api',
  EMAIL: 'email',
  MASTERCARD_MERCHANT_SCREENING: 'mastercard-merchant-screening',
  INDIVIDUAL_SANCTIONS_V2: 'individual-sanctions-v2',
  BANK_ACCOUNT_VERIFICATION: 'bank-account-verification',
  COMMERCIAL_CREDIT_CHECK: 'commercial-credit-check',
} as const;

export const pluginsRegistry = {
  [PluginKind.KYC]: KycPlugin,
  [PluginKind.KYB]: KybPlugin,
  [PluginKind.WEBHOOK]: WebhookPlugin,
  [PluginKind.API]: ApiPlugin,
  [PluginKind.EMAIL]: EmailPlugin,
  [PluginKind.MASTERCARD_MERCHANT_SCREENING]: MastercardMerchantScreeningPlugin,
  [PluginKind.INDIVIDUAL_SANCTIONS_V2]: IndividualsSanctionsV2Plugin,
  [PluginKind.BANK_ACCOUNT_VERIFICATION]: BankAccountVerificationPlugin,
  [PluginKind.COMMERCIAL_CREDIT_CHECK]: CommercialCreditCheckPlugin,
  [BALLERINE_API_PLUGINS['individual-sanctions']]: BallerineApiPlugin,
  [BALLERINE_API_PLUGINS['company-sanctions']]: BallerineApiPlugin,
  [BALLERINE_API_PLUGINS['ubo']]: BallerineApiPlugin,
  [BALLERINE_API_PLUGINS['registry-information']]: BallerineApiPlugin,
  [BALLERINE_API_PLUGINS['merchant-monitoring']]: BallerineApiPlugin,
  [BALLERINE_API_PLUGINS['template-email']]: BallerineEmailPlugin,
  [BALLERINE_API_PLUGINS['kyc-session']]: KycSessionPlugin,
} as const satisfies Readonly<
  Record<
    ObjectValues<typeof PluginKind & typeof BALLERINE_API_PLUGINS>,
    new (...args: any[]) => any
  >
>;

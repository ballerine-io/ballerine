import { KycPlugin } from './plugins/external-plugin/kyc-plugin';
import { KycSessionPlugin } from './plugins/external-plugin/kyc-session-plugin';
import { KybPlugin } from './plugins/external-plugin/kyb-plugin';
import { ApiPlugin, WebhookPlugin } from './plugins';
import { EmailPlugin } from './plugins/external-plugin/email-plugin';
import { MastercardMerchantScreeningPlugin } from './plugins/external-plugin/mastercard-merchant-screening-plugin';
import { ObjectValues } from './types';
import { BALLERINE_API_PLUGINS } from './plugins/external-plugin/vendor-consts';
import { BallerineApiPlugin } from './plugins/external-plugin/ballerine-plugin';
import { BallerineEmailPlugin } from './plugins/external-plugin/ballerine-email-plugin';

export const PluginKind = {
  KYC: 'kyc',
  KYB: 'kyb',
  WEBHOOK: 'webhook',
  API: 'api',
  EMAIL: 'email',
  MASTERCARD_MERCHANT_SCREENING: 'mastercard-merchant-screening',
} as const;

export const pluginsRegistry = {
  [PluginKind.KYC]: KycPlugin,
  [PluginKind.KYB]: KybPlugin,
  [PluginKind.WEBHOOK]: WebhookPlugin,
  [PluginKind.API]: ApiPlugin,
  [PluginKind.EMAIL]: EmailPlugin,
  [PluginKind.MASTERCARD_MERCHANT_SCREENING]: MastercardMerchantScreeningPlugin,
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

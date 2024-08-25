import { KycPlugin } from './plugins/external-plugin/kyc-plugin';
import { KycSessionPlugin } from './plugins/external-plugin/kyc-session-plugin';
import { KybPlugin } from './plugins/external-plugin/kyb-plugin';
import { ApiPlugin, WebhookPlugin } from './plugins';
import { EmailPlugin } from './plugins/external-plugin/email-plugin';
import { MasterCardMerchantScreeningPlugin } from './plugins/external-plugin/master-card-merchant-screening-plugin';
import { ObjectValues } from './types';

export const PluginKind = {
  KYC: 'kyc',
  KYC_SESSION: 'kyc-session',
  KYB: 'kyb',
  WEBHOOK: 'webhook',
  API: 'api',
  EMAIL: 'email',
  MASTER_CARD_MERCHANT_SCREENING: 'mastercard-merchant-screening',
} as const;

export const pluginsRegistry = {
  [PluginKind.KYC]: KycPlugin,
  [PluginKind.KYC_SESSION]: KycSessionPlugin,
  [PluginKind.KYB]: KybPlugin,
  [PluginKind.WEBHOOK]: WebhookPlugin,
  [PluginKind.API]: ApiPlugin,
  [PluginKind.EMAIL]: EmailPlugin,
  [PluginKind.MASTER_CARD_MERCHANT_SCREENING]: MasterCardMerchantScreeningPlugin,
} as const satisfies Readonly<Record<ObjectValues<typeof PluginKind>, new (...args: any[]) => any>>;

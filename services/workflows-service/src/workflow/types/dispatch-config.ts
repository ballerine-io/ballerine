export interface WebhookDispatchConfig {
  url: string;
  authorizationKey: string;
  secretType: 'basic-auth' | 'signature';
}

export type DispatchConfig = WebhookDispatchConfig;

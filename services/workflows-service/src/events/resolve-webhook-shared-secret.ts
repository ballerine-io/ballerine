import { ConfigService } from '@nestjs/config';

export const isPlaceholderWebhookSharedSecret = (value?: string | null) => {
  if (!value) {
    return true;
  }

  const normalized = value.trim();

  return normalized.length === 0 || normalized === 'TODO_SET_ME';
};

export const getEnvWebhookSharedSecret = (configService: ConfigService) =>
  configService.get<string>('LOANCUBE_WEBHOOK_SECRET') ||
  configService.get<string>('BALLERINE_WEBHOOK_SECRET');

export const resolveWebhookSharedSecret = ({
  configuredWebhookSharedSecret,
  configService,
}: {
  configuredWebhookSharedSecret?: string | null;
  configService: ConfigService;
}) => {
  if (!isPlaceholderWebhookSharedSecret(configuredWebhookSharedSecret)) {
    return configuredWebhookSharedSecret!.trim();
  }

  const envWebhookSharedSecret = getEnvWebhookSharedSecret(configService);

  if (!isPlaceholderWebhookSharedSecret(envWebhookSharedSecret)) {
    return envWebhookSharedSecret!.trim();
  }

  return undefined;
};

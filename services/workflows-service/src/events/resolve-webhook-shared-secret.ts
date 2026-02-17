import { ConfigService } from '@nestjs/config';

const isPlaceholderSecret = (value?: string | null) => {
  if (!value) {
    return true;
  }

  const normalized = value.trim();
  return normalized.length === 0 || normalized === 'TODO_SET_ME';
};

export const resolveWebhookSharedSecret = ({
  configuredWebhookSharedSecret,
  configService,
}: {
  configuredWebhookSharedSecret?: string | null;
  configService: ConfigService;
}) => {
  if (!isPlaceholderSecret(configuredWebhookSharedSecret)) {
    return configuredWebhookSharedSecret!.trim();
  }

  const envWebhookSharedSecret =
    configService.get<string>('LOANCUBE_WEBHOOK_SECRET') ||
    configService.get<string>('BALLERINE_WEBHOOK_SECRET');

  if (!isPlaceholderSecret(envWebhookSharedSecret)) {
    return envWebhookSharedSecret!.trim();
  }

  return undefined;
};

import { env } from '@/env';
import { faker } from '@faker-js/faker';
import { ApiKeyType } from '@prisma/client';
import * as crypto from 'crypto';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const PASSWORD_REGEX = /[!@#$%^&*a-zA-Z]/;
const API_KEY_LEN = 50;

export const encryptApiKey = (apiKey: string) => {
  if (apiKey && apiKey.length <= 5) {
    throw new Error('Invalid api key length');
  }

  const hmac = crypto.createHmac('sha256', env.API_KEY_SECRET);
  hmac.update(apiKey);
  return hmac.digest('hex');
};

export const generateApiKey = (options?: {
  apiKey?: string | undefined;
  expiresInDays?: number | undefined;
  salt?: string | undefined;
}) => {
  const { apiKey, expiresInDays } = { apiKey: undefined, expiresInDays: undefined, ...options };

  const _apiKey = apiKey ?? faker.internet.password(API_KEY_LEN, false, PASSWORD_REGEX);

  const hashedKey = encryptApiKey(_apiKey);

  const validUntil = expiresInDays
    ? new Date(Date.now() + expiresInDays * ONE_DAY_IN_MS)
    : undefined;

  return { apiKey: _apiKey, hashedKey, validUntil, type: ApiKeyType.one_way };
};

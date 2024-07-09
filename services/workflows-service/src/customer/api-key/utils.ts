import { env } from '@/env';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const PASSWORD_REGEX = /[!@#$%^&*a-zA-Z]/;

const API_KEY_LEN = 50;

export const KEY_MIN_LENGTH = 5;

export const SALT = (
  env.HASHING_KEY_SECRET_BASE64
    ? Base64.decode(env.HASHING_KEY_SECRET_BASE64)
    : env.HASHING_KEY_SECRET
) as string;

const DEFAULT_HASHIING_OPTIONS = {
  key: undefined,
  expiresInDays: undefined,
};

export const hashKey = async (key: string, salt?: string | number) => {
  const _salt = salt ?? SALT;

  return new Promise<string>((resolve, reject) => {
    if (key && key.length < KEY_MIN_LENGTH) {
      return reject(new Error('Invalid key length'));
    }

    bcrypt.hash(key, _salt, (err, hashedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedKey);
      }
    });
  });
};

export const generateHashedKey = async (options?: {
  key?: string | undefined;
  expiresInDays?: number | undefined;
  salt?: string | undefined;
}) => {
  const { key, expiresInDays, salt } = { ...DEFAULT_HASHIING_OPTIONS, ...options };

  const _key = key ?? faker.internet.password(API_KEY_LEN, false, PASSWORD_REGEX);

  const hashedKey = await hashKey(_key, salt);

  const validUntil = expiresInDays
    ? new Date(Date.now() + expiresInDays * ONE_DAY_IN_MS)
    : undefined;

  return { apiKey: _key, hashedKey, validUntil };
};

export const generateSalt = (rounds?: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds ?? 10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
};

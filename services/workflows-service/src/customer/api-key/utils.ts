import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const PASSWORD_REGEX = /[!@#$%^&*a-zA-Z]/;

const API_KEY_LEN = 50;

export const KEY_MIN_LENGTH = 5;

const SALT = process.env.HASHING_KEY_SECRET_BASE64
  ? Base64.decode(process.env.HASHING_KEY_SECRET_BASE64)
  : process.env.HASHING_KEY_SECRET;

const DEFAULT_HASHIING_OPTIONS = {
  key: undefined,
  expiresInDays: undefined,
  salt: SALT,
};

export const hashKeyOrThrow = async (key: string, salt: string) => {
  if (salt === undefined || !salt) {
    throw new Error('Invalid salt value: HASHING_KEY_SECRET_BASE64');
  }

  return hashKey('check salt value', salt);
};

export const hashKey = async (key: string, salt: string | number = SALT) => {
  return new Promise<string>((resolve, reject) => {
    if (key && key.length < KEY_MIN_LENGTH) {
      return reject(new Error('Invalid key length'));
    }

    bcrypt.hash(key, salt, (err, hashedKey) => {
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

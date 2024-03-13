import { createHmac, createHash } from 'node:crypto';

/**
 * Signs a payload with a key.
 */
export const sign = ({ payload, key }: { payload: unknown; key: string }) => {
  return createHmac('sha256', key).update(JSON.stringify(payload)).digest('hex');
};

export const computeHash = (data: unknown): string => {
  const md5hash = createHash('md5');
  md5hash.update(JSON.stringify(data));

  return md5hash.digest('hex');
};

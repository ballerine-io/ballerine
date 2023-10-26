import { createHmac } from 'node:crypto';

/**
 * Signs a payload with a key.
 */
export const sign = ({ payload, key }: { payload: unknown; key: string }) => {
  return createHmac('sha256', key).update(JSON.stringify(payload)).digest('hex');
};

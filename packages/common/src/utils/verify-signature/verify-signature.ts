import { createHmac } from 'node:crypto';

/**
 * Verifies a signature against a payload and key.
 */
export const verifySignature = ({
  payload,
  key,
  signature,
}: {
  payload: unknown;
  key: string;
  signature: string;
}) => {
  return (
    signature.toLowerCase() ===
    createHmac('sha256', key)
      .update(Buffer.from(JSON.stringify(payload), 'utf8'))
      .digest('hex')
      .toLowerCase()
  );
};

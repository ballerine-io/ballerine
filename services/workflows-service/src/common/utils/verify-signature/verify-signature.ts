import { createHmac } from 'node:crypto';
import stableStringify from 'json-stable-stringify';

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
  const normalizedPayload = stableStringify(payload) ?? '';

  return (
    signature.toLowerCase() ===
    createHmac('sha256', key)
      .update(Buffer.from(normalizedPayload, 'utf8') as unknown as Uint8Array)
      .digest('hex')
      .toLowerCase()
  );
};

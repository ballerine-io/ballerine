import crypto from 'crypto';

const DEFAULT_TTL_SECONDS = 30 * 60; // 30 minutes

const pickFirstNonEmpty = (values: Array<string | undefined | null>) =>
  values.find(v => typeof v === 'string' && v.trim().length > 0)?.trim();

export const getFileLinkSigningSecret = (): string | undefined => {
  // Prefer dedicated env, then fall back to existing strong secrets already provisioned in prod.
  return pickFirstNonEmpty([
    process.env.FILE_LINK_SIGNING_SECRET,
    process.env.UNIFIED_API_SHARED_SECRET,
    process.env.HASHING_KEY_SECRET,
    process.env.SESSION_SECRET,
  ]);
};

export const createFileLinkSignature = ({
  fileId,
  projectId,
  expires,
  secret,
}: {
  fileId: string;
  projectId: string;
  expires: number;
  secret: string;
}) => {
  const data = `${fileId}.${projectId}.${expires}`;

  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const verifyFileLinkSignature = ({
  fileId,
  projectId,
  expires,
  sig,
  secret,
}: {
  fileId: string;
  projectId: string;
  expires: number;
  sig: string;
  secret: string;
}) => {
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(expires) || expires <= now) {
    return false;
  }

  const expected = createFileLinkSignature({ fileId, projectId, expires, secret });

  // Constant-time compare
  try {
    const expectedBuf = Buffer.from(expected, 'utf8');
    const sigBuf = Buffer.from(sig, 'utf8');

    if (expectedBuf.length !== sigBuf.length) {
      return false;
    }

    // Node 23 type definitions are stricter; compare Uint8Array views.
    return crypto.timingSafeEqual(Uint8Array.from(expectedBuf), Uint8Array.from(sigBuf));
  } catch {
    return false;
  }
};

export const createSignedPublicFileUrl = ({
  fileId,
  projectId,
  ttlSeconds = DEFAULT_TTL_SECONDS,
}: {
  fileId: string;
  projectId: string;
  ttlSeconds?: number;
}) => {
  const baseUrl = process.env.APP_API_URL;
  if (!baseUrl) {
    throw new Error('APP_API_URL is not set (required to build public file URLs)');
  }

  const secret = getFileLinkSigningSecret();
  if (!secret) {
    throw new Error(
      'Missing signing secret for public file URLs (set FILE_LINK_SIGNING_SECRET or reuse existing secrets).',
    );
  }

  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = createFileLinkSignature({ fileId, projectId, expires, secret });

  const url = new URL(`/api/v1/public/files/${fileId}/content`, baseUrl);
  url.searchParams.set('projectId', projectId);
  url.searchParams.set('expires', String(expires));
  url.searchParams.set('sig', sig);

  return url.toString();
};

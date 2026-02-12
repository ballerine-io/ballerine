type TIdTokenCacheEntry = { token: string; expMs: number };

const cache = new Map<string, TIdTokenCacheEntry>();

const decodeJwtExpMs = (jwt: string): number | null => {
  const parts = jwt.split('.');
  if (parts.length < 2) return null;

  const payloadB64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/');
  const padded = payloadB64.padEnd(Math.ceil(payloadB64.length / 4) * 4, '=');

  try {
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as {
      exp?: number;
    };
    if (!payload.exp) return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const getGcpIdToken = async (audience: string): Promise<string | null> => {
  // Cloud Run sets K_SERVICE; avoid metadata calls in local/dev and other runtimes.
  if (!process.env.K_SERVICE) return null;

  const cached = cache.get(audience);
  if (cached && Date.now() < cached.expMs - 60_000) return cached.token;

  const url = new URL(
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity',
  );
  url.searchParams.set('audience', audience);
  url.searchParams.set('format', 'full');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Metadata-Flavor': 'Google' },
    });
    if (!res.ok) {
      console.warn(
        `[getGcpIdToken] Metadata server returned ${res.status} for audience=${audience}`,
      );
      return null;
    }

    const token = await res.text();
    const expMs = decodeJwtExpMs(token) ?? Date.now() + 5 * 60_000;
    cache.set(audience, { token, expMs });

    return token;
  } catch (err) {
    console.warn('[getGcpIdToken] Failed to fetch ID token from metadata server', err);
    return null;
  }
};

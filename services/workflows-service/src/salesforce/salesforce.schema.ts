import { z } from 'zod';

export const GetAccessTokenSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
    instance_url: z.string().url(),
    id: z.string().url(),
    issued_at: z.coerce.number(),
  })
  .transform(data => ({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope,
    instanceUrl: data.instance_url,
    idUrl: data.id,
    issuedAt: data.issued_at,
  }));

export const GetUserInfoSchema = z
  .object({
    user_id: z.string(),
    organization_id: z.string(),
  })
  .transform(data => ({
    userId: data.user_id,
    organizationId: data.organization_id,
  }));

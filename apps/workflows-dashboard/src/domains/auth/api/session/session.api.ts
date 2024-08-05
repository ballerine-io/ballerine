import { GetSessionResponse } from '@/domains/auth/api/session/session.types';
import { IUser } from '@/domains/auth/common/types';
import { request } from '@/lib/request';
import posthog from 'posthog-js';

export async function fetchSession(): Promise<IUser | null> {
  const result = await request.get<GetSessionResponse>('internal/auth/session');
  if (result.data.user) {
    try {
      posthog.identify(result.data.user.id, {
        email: result.data.user.email,
        name: result.data.user.firstName + ' ' + result.data.user.lastName,
      });
    } catch (error) {
      console.error('Error identifying user in PostHog:', error);
    }
  }

  return result.data.user ? result.data.user : null;
}

import { GetSessionResponse } from '@/domains/auth/api/session/session.types';
import { IUser } from '@/domains/auth/common/types';
import { request } from '@/lib/request';

export async function fetchSession(): Promise<IUser | null> {
  const result = await request.get<GetSessionResponse>('internal/auth/session');

  return result.data.user ? result.data.user : null;
}

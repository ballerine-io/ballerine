import { GetSessionResponse } from '@app/domains/auth/api/session/session.types';
import { IUser } from '@app/domains/auth/common/types';
import { request } from '@app/lib/request';

export async function fetchSession(): Promise<IUser | null> {
  const result = await request.get<GetSessionResponse>('internal/auth/session');

  return result.data.user ? result.data.user : null;
}

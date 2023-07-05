import { request } from '@app/lib/request';

export async function fetchLogout(): Promise<boolean> {
  await request.post('/internal/auth/logout');

  return true;
}

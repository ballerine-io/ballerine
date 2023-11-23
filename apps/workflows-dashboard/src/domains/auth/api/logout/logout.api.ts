import { request } from '@/lib/request';

export async function fetchLogout(): Promise<boolean> {
  await request.post('/internal/auth/logout');

  return true;
}

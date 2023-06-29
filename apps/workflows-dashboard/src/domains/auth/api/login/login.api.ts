import { GetSignInDto, GetSignInResponse } from '@app/domains/auth/api/login/login.types';
import { request } from '@app/lib/request';

export async function fetchSignIn(dto: GetSignInDto): Promise<GetSignInResponse> {
  const result = await request.post<GetSignInResponse>('internal/auth/login', dto);

  return result.data;
}

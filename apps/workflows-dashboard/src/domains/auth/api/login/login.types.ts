import { IUser } from '@/domains/auth/common/types';

export interface GetSignInDto {
  email: string;
  password: string;
}

export interface GetSignInResponse {
  user: IUser;
}

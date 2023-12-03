import { IUser } from '@/domains/auth/common/types';

export interface GetSessionResponse {
  user?: IUser;
}

import { IUser } from '@app/domains/auth/common/types';

export interface GetSessionResponse {
  user?: IUser;
}

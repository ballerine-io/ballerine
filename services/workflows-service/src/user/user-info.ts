import { UserModel } from './user.model';

export class UserInfo implements Partial<UserModel> {
  id!: string;
  username!: string;
  roles!: string[];
  accessToken?: string;
}

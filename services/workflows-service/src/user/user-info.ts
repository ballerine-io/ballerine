import { UserModel } from './user.model';

export class UserInfo implements Partial<UserModel> {
  id!: string;
  email!: string;
  roles!: string[];
  accessToken?: string;
}

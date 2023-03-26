import { UserInfo } from '../user/user-info';

export interface IAuthStrategy {
  validate: (...args: Array<any>) => Promise<UserInfo>;
}


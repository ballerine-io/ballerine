import { UserInfo } from '../user/user-info';

export interface IAuthStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (...args: Array<any>) => Promise<UserInfo>;
}

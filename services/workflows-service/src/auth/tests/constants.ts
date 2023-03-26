import { LoginDto } from '../dtos/login';
import { UserInfo } from '../../user/user-info';

export const VALID_ID = '1';

export const TEST_USER: UserInfo = {
  id: 'cl7qmjh4h0000tothyjqapgj5',
  roles: ['Operator'],
  username: 'ofek',
};
export const SIGN_TOKEN = 'SIGN_TOKEN';
export const VALID_CREDENTIALS: LoginDto = {
  username: 'Valid User',
  password: 'Valid User Password',
};
export const INVALID_CREDENTIALS: LoginDto = {
  username: 'Invalid User',
  password: 'Invalid User Password',
};

import { LoginDto } from '../dtos/login';
import { UserInfo } from '../../user/user-info';

export const VALID_ID = '1';

export const TEST_USER: UserInfo = {
  id: 'cl7qmjh4h0000tothyjqapgj5',
  email: 'ofek',
  firstName: 'Ofek',
  lastName: 'Levy',
  roles: ['Operator'],
};
export const SIGN_TOKEN = 'SIGN_TOKEN';
export const VALID_CREDENTIALS: LoginDto = {
  email: 'Valid User',
  password: 'Valid User Password',
};
export const INVALID_CREDENTIALS: LoginDto = {
  email: 'Invalid User',
  password: 'Invalid User Password',
};

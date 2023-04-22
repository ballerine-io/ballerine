/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { PasswordService } from './password/password.service';
import { TokenService } from './token/token.service';
import { VALID_ID } from './tests/constants';

const VALID_CREDENTIALS: LoginDto = {
  username: 'Valid User',
  password: 'Valid User Password',
};
const INVALID_CREDENTIALS: LoginDto = {
  username: 'Invalid User',
  password: 'Invalid User Password',
};
const USER = {
  ...VALID_CREDENTIALS,
  createdAt: new Date(),
  id: VALID_ID,
  roles: ['admin'],
  updatedAt: new Date(),
};

const SIGN_TOKEN = 'SIGN_TOKEN';

const userService = {
  getByUsername(username: string): any | null {
    if (username === VALID_CREDENTIALS.username) {
      return USER;
    }
    return null;
  },
};

const passwordService = {
  compare() {
    return true;
  },
};

const tokenService = {
  createToken() {
    return SIGN_TOKEN;
  },
};

describe('AuthService', () => {
  //ARRANGE
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
        {
          provide: TokenService,
          useValue: tokenService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing the authService.validateUser()', () => {
    it('should validate a valid user', async () => {
      await expect(
        service.validateUser(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password),
      ).resolves.toEqual({
        username: USER.username,
        roles: USER.roles,
        id: USER.id,
      });
    });

    it('should not validate a invalid user', async () => {
      await expect(
        service.validateUser(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password),
      ).resolves.toBe(null);
    });
  });

  describe('Testing the authService.login()', () => {
    it('should return userInfo object for correct username and password', async () => {
      const loginResult = await service.login(VALID_CREDENTIALS);
      expect(loginResult).toEqual({
        username: USER.username,
        roles: USER.roles,
        accessToken: SIGN_TOKEN,
        id: USER.id,
      });
    });
  });
});

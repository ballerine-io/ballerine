import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { PasswordService } from './password/password.service';
import { VALID_ID } from './tests/constants';

const VALID_CREDENTIALS: LoginDto = {
  email: 'Valid User',
  password: 'Valid User Password',
};
const INVALID_CREDENTIALS: LoginDto = {
  email: 'Invalid User',
  password: 'Invalid User Password',
};
const USER = {
  ...VALID_CREDENTIALS,
  createdAt: new Date(),
  id: VALID_ID,
  status: 'Active',
  roles: ['admin'],
  updatedAt: new Date(),
};

const userService = {
  getByEmail: (email: string): any | null => {
    if (email === VALID_CREDENTIALS.email) {
      return USER;
    }

    return null;
  },
  getByEmailUnscoped(email: any) {
    return this.getByEmail(email);
  },
};

const passwordService = {
  compare: () => {
    return true;
  },
};

describe('AuthService', () => {
  //ARRANGE
  beforeEach(() => {
    USER.status = 'Active';
  });

  let service: AuthService;
  beforeAll(async () => {
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
        service.validateUser(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password),
      ).resolves.toEqual({
        email: USER.email,
        roles: USER.roles,
        id: USER.id,
      });
    });

    it('should not validate a invalid user', async () => {
      await expect(
        service.validateUser(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password),
      ).resolves.toBe(null);
    });

    describe('when user is inactive', () => {
      beforeEach(() => {
        USER.status = 'Blocked';
      });

      it('it throws an UnauthorizedException', async () => {
        await expect(
          async () =>
            await service.validateUser(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password),
        ).rejects.toThrowError('Unauthorized');
      });
    });
  });
});

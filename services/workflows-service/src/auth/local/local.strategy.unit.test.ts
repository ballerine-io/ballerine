import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';
import { TEST_USER } from '../tests/constants';

describe('Testing the localStrategyBase.validate()', () => {
  const TEST_PASSWORD = 'gabay';
  const authService = mock<AuthService>();
  const localStrategy = new LocalStrategy(authService);
  beforeEach(() => {
    authService.authenticateUserByPassword.mockClear();
  });
  beforeAll(() => {
    //ARRANGE
    authService.authenticateUserByPassword
      .calledWith(TEST_USER.email, TEST_PASSWORD)
      .mockReturnValue(Promise.resolve(TEST_USER));
  });
  it('should return the user', async () => {
    //ACT
    const result = await localStrategy.validate(TEST_USER.email, TEST_PASSWORD);
    //ASSERT
    expect(result).toBe(TEST_USER);
  });
  it('should throw error if there is not valid user', async () => {
    //ARRANGE
    authService.authenticateUserByPassword.mockReturnValue(Promise.resolve(null));
    //ACT
    const result = localStrategy.validate('noUsername', TEST_PASSWORD);

    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});

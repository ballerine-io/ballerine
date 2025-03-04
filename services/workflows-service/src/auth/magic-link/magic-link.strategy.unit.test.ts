import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { MagicLinkStrategy } from './magic-link.strategy';
import { TEST_USER } from '../tests/constants';

describe('Testing the magicLinkStrategy.validate()', () => {
  const TEST_USER_ID = 'uid-012345';

  const authService = mock<AuthService>();
  const magicLinkStrategy = new MagicLinkStrategy(authService);

  beforeEach(() => {
    authService.authenticateUserById.mockClear();
  });

  it('should return the user', async () => {
    //ARRANGE
    authService.authenticateUserById
      .calledWith(TEST_USER_ID)
      .mockReturnValue(Promise.resolve(TEST_USER));
    //ACT
    const result = await magicLinkStrategy.validate({ sub: TEST_USER_ID });
    //ASSERT
    expect(result).toBe(TEST_USER);
  });

  it('should throw error if there is not valid user', async () => {
    //ARRANGE
    authService.authenticateUserById.mockReturnValue(Promise.resolve(null));
    //ACT
    const result = magicLinkStrategy.validate({ sub: 'bad-id' });

    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});

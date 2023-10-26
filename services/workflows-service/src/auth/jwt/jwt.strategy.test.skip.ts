import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';
import { TEST_USER } from '../tests/constants';

describe.skip('Testing the jwtStrategyBase.validate()', () => {
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService);
  beforeEach(() => {
    userService.getByEmailUnscoped.mockClear();
  });
  it.skip('should throw UnauthorizedException where there is no user', async () => {
    //ARRANGE
    userService.getByEmailUnscoped
      .calledWith(TEST_USER.email)
      .mockReturnValue(Promise.resolve(null));
    //ACT
    const result = jwtStrategy.validate({
      id: TEST_USER.id,
      email: TEST_USER.email,
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
      roles: TEST_USER.roles,
    });
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});

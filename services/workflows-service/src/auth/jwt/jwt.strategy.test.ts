import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';
import { TEST_USER } from '../tests/constants';

describe('Testing the jwtStrategyBase.validate()', () => {
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService, 'Secrete');
  beforeEach(() => {
    userService.getByEmail.mockClear();
  });
  it('should throw UnauthorizedException where there is no user', async () => {
    //ARRANGE
    userService.getByEmail.calledWith(TEST_USER.email).mockReturnValue(Promise.resolve(null));
    //ACT
    const result = jwtStrategy.validate({
      id: TEST_USER.id,
      email: TEST_USER.email,
      roles: TEST_USER.roles,
    });
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});

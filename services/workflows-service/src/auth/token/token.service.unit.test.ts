import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';
import { TokenService } from './token.service';
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from '../auth-errors';
import { SIGN_TOKEN, VALID_CREDENTIALS, VALID_ID } from '../tests/constants';

describe('Testing the TokenService', () => {
  let tokenServiceBase: TokenService;
  const jwtService = mock<JwtService>();
  beforeEach(() => {
    tokenServiceBase = new TokenService(jwtService);
    jwtService.signAsync.mockClear();
  });
  describe('Testing the BasicTokenService.createToken()', () => {
    it('should create valid token for valid email and password', async () => {
      jwtService.signAsync.mockReturnValue(Promise.resolve(SIGN_TOKEN));
      expect(
        await tokenServiceBase.createToken({
          id: VALID_ID,
          email: VALID_CREDENTIALS.email,
          password: VALID_CREDENTIALS.password,
        }),
      ).toBe(SIGN_TOKEN);
    });
    it('should reject when email missing', () => {
      const result = tokenServiceBase.createToken({
        id: VALID_ID,
        email: null as never,
        password: VALID_CREDENTIALS.password,
      });
      return expect(result).rejects.toBe(INVALID_USERNAME_ERROR);
    });
    it('should reject when password missing', () => {
      const result = tokenServiceBase.createToken({
        id: VALID_ID,
        email: VALID_CREDENTIALS.email,
        password: null as never,
      });
      return expect(result).rejects.toBe(INVALID_PASSWORD_ERROR);
    });
  });
});

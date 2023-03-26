import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from '../auth-errors';
import { ITokenService, ITokenPayload } from './types';

/**
 * TokenServiceBase is a jwt bearer implementation of ITokenService
 */
@Injectable()
export class TokenService implements ITokenService {
  constructor(protected readonly jwtService: JwtService) {}
  /**
   *
   * @object { id: String, username: String, password: String}
   * @returns a jwt token sign with the username and user id
   */
  createToken({ id, username, password }: ITokenPayload): Promise<string> {
    if (!username) return Promise.reject(INVALID_USERNAME_ERROR);
    if (!password) return Promise.reject(INVALID_PASSWORD_ERROR);
    return this.jwtService.signAsync({
      sub: id,
      username,
    });
  }
}

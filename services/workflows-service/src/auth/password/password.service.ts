import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { env } from '@/env';

/** Salt or number of rounds to generate a salt */
export type Salt = string | number;

@Injectable()
export class PasswordService {
  /**
   * the salt to be used to hash the password. if specified as a number then a
   * salt will be generated with the specified number of rounds and used
   */
  salt: Salt;

  constructor() {
    this.salt = env.BCRYPT_SALT || 10;
  }

  /**
   *
   * @param password the password to be encrypted.
   * @param encrypted the encrypted password to be compared against.
   * @returns whether the password match the encrypted password
   */
  compare(password: string, encrypted: string): Promise<boolean> {
    return compare(password, encrypted);
  }

  /**
   * @param password the password to be encrypted
   * @return encrypted password
   */
  hash(password: string): Promise<string> {
    return hash(password, this.salt);
  }
}

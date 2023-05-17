import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISecretsManager } from './types';

@Injectable()
export class SecretsManagerService implements ISecretsManager {
  constructor(protected readonly configService: ConfigService) {}

  async fetchSecret<T>(key: string): Promise<T | null> {
    if (!key) {
      throw new Error("Didn't got the key");
    }

    const value = this.configService.get<T>(key);

    if (value) {
      return Promise.resolve(value);
    }
    return Promise.resolve(null);
  }

  getSecret<T>(key: string): T | null {
    if (!key) {
      throw new Error("Didn't got the key");
    }

    const value = this.configService.get<T>(key);

    if (value) {
      return value;
    }
    return null;
  }

  getSecretOrThrow<T>(key: string): T {
    if (!key) {
      throw new Error("Didn't got the key");
    }

    const value = this.configService.get<T>(key);

    if (typeof value === 'undefined') {
      throw new Error(`Secret ${key} not found`);
    }

    return value;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISecretsManager } from './types';

@Injectable()
export class SecretsManagerService implements ISecretsManager {
  constructor(protected readonly configService: ConfigService) {}

  async getSecret<T>(key: string): Promise<T | null> {
    if (!key) {
      throw new Error("Didn't got the key");
    }

    const value = this.configService.get<T>(key);

    if (value) {
      return Promise.resolve(value);
    }
    return Promise.resolve(null);
  }
}

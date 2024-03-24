import { ApiKeyRepository } from './api-key.repository';

import { Injectable } from '@nestjs/common';
import { ApiKey } from '@prisma/client';
import { encryptApiKey, generateApiKey } from './utils';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async createHashedApiKey(
    customerId: string,
    options?: { apiKey?: string; expiresInDays?: number },
  ): Promise<ApiKey> {
    const { hashedKey, validUntil, type } = generateApiKey(options);

    const dbApiKey = await this.apiKeyRepository.create({
      data: {
        customerId,
        type,
        hashedKey,
        validUntil,
      },
    });

    return dbApiKey;
  }

  async find(apiKey: string) {
    const hashedKey = encryptApiKey(apiKey);

    return await this.apiKeyRepository.find(hashedKey);
  }

  async deleteApiKey(hashedKey: string) {
    return await this.apiKeyRepository.delete(hashedKey);
  }

  verifyHashedApiKey(apiKey: string, hashedApiKey: string) {
    return encryptApiKey(hashedApiKey) === apiKey;
  }
}

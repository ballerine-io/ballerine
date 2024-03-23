import { PrismaService } from './../../prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { ApiKey } from '@prisma/client';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const PASSWORD_REGEX = /[!@#$%^&*a-zA-Z]/;
const API_KEY_LEN = 50;

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async createApiKey(
    projectId: string,
    options?: { apiKey?: string; expiresInDays?: number; salt?: string },
  ): Promise<ApiKey> {
    const { apiKey, expiresInDays, salt } = {
      apiKey: undefined,
      expiresInDays: undefined,
      salt: undefined,
      ...options,
    };

    const _salt = salt ?? (await this.generateSalt());

    const _apiKey = apiKey ?? faker.internet.password(API_KEY_LEN, false, PASSWORD_REGEX);

    const hashedKey = await this._hashApiKey(_apiKey, _salt);

    const validUntil = expiresInDays
      ? new Date(Date.now() + expiresInDays * ONE_DAY_IN_MS)
      : undefined;

    const dbApiKey = await this.prisma.apiKey.create({
      data: {
        projectId,
        salt: _salt,
        hashedKey,
        validUntil,
      },
    });

    return dbApiKey;
  }

  async getApiKey(projectId: string, hashedKey: string): Promise<string | null> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: {
        projectId_hashedKey: {
          projectId,
          hashedKey,
        },
      },
    });

    return apiKey?.id || null;
  }

  async deleteApiKey(projectId: string, hashedKey: string): Promise<void> {
    await this.prisma.apiKey.delete({
      where: {
        projectId_hashedKey: {
          projectId,
          hashedKey,
        },
      },
    });
  }

  async _hashApiKey(apiKey: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(apiKey, salt, (err, hashedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(hashedKey);
        }
      });
    });
  }

  async verifyApiKey(apiKey: string, salt: string, hashedApiKey: string): Promise<boolean> {
    return bcrypt.compare(apiKey + salt, hashedApiKey);
  }

  async generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        } else {
          resolve(salt);
        }
      });
    });
  }
}

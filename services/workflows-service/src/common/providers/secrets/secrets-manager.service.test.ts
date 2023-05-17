import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { SecretsManagerService } from './secrets-manager.service';

describe('Testing the secrets manager base class', () => {
  const SECRET_KEY = 'SECRET_KEY';
  const SECRET_VALUE = 'SECRET_VALUE';
  const configService = mock<ConfigService>();
  const secretsManagerService = new SecretsManagerService(configService);
  beforeEach(() => {
    configService.get.mockClear();
  });
  it('should return value from env', async () => {
    //ARRANGE
    configService.get.mockReturnValue(SECRET_VALUE);
    //ACT
    const result = await secretsManagerService.fetchSecret<unknown>(SECRET_KEY);
    //ASSERT
    expect(result).toBe(SECRET_VALUE);
  });
  it('should return null for unknown keys', async () => {
    //ARRANGE
    configService.get.mockReturnValue(undefined);
    //ACT
    const result = await secretsManagerService.fetchSecret(SECRET_KEY);
    //ASSERT
    expect(result).toBeNull();
  });
  it('should throw error if dont get key', () => {
    //@ts-expect-error - testing with no key
    return expect(secretsManagerService.fetchSecret()).rejects.toThrow();
  });
  it('should throw an exeption if getting null key', () => {
    //@ts-expect-error - testing with null key
    return expect(secretsManagerService.fetchSecret(null)).rejects.toThrow();
  });
});

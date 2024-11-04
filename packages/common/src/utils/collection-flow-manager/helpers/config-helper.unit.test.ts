import { DefaultContextSchema } from '@/schemas';
import { describe, expect, test } from 'vitest';
import { ConfigHelper } from './config-helper';

describe('ConfigHelper', () => {
  test('should be defined', () => {
    const configHelper = new ConfigHelper({
      collectionFlow: { config: {} },
    } as DefaultContextSchema);

    expect(configHelper).toBeDefined();
  });

  describe('apiUrl', () => {
    test('should be able to get and set', () => {
      const configHelper = new ConfigHelper({
        collectionFlow: { config: { apiUrl: 'https://api.example.com' } },
      } as DefaultContextSchema);

      expect(configHelper.apiUrl).toBe('https://api.example.com');

      configHelper.apiUrl = 'https://api.example.com/v2';

      expect(configHelper.apiUrl).toBe('https://api.example.com/v2');
    });
  });

  describe('override', () => {
    test('should be able to override config', () => {
      const ctx = { collectionFlow: { config: {} } } as DefaultContextSchema;

      const configHelper = new ConfigHelper(ctx);

      configHelper.override({
        apiUrl: 'https://api.example.com',
      });

      expect(configHelper.apiUrl).toBe('https://api.example.com');
      expect(ctx.collectionFlow?.config?.apiUrl).toBe('https://api.example.com');
      expect(ctx.collectionFlow?.config).toEqual({
        apiUrl: 'https://api.example.com',
      });
    });
  });
});

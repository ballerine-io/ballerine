import { CollectionFlowContextSchema } from '@/schemas';
import { describe, expect, test } from 'vitest';
import { ConfigHelper } from './config-helper';

describe('ConfigHelper', () => {
  test('should be defined', () => {
    const configHelper = new ConfigHelper({
      collectionFlow: { config: {} },
    } as CollectionFlowContextSchema);

    expect(configHelper).toBeDefined();
  });

  describe('apiUrl', () => {
    test('should be able to get and set', () => {
      const configHelper = new ConfigHelper({
        collectionFlow: { config: { apiUrl: 'https://api.example.com' } },
      } as CollectionFlowContextSchema);

      expect(configHelper.apiUrl).toBe('https://api.example.com');

      configHelper.apiUrl = 'https://api.example.com/v2';

      expect(configHelper.apiUrl).toBe('https://api.example.com/v2');
    });
  });

  describe('tokenId', () => {
    test('should be able to get and set', () => {
      const configHelper = new ConfigHelper({
        collectionFlow: { config: { tokenId: '1234567890' } },
      } as CollectionFlowContextSchema);

      expect(configHelper.tokenId).toBe('1234567890');

      configHelper.tokenId = '0987654321';

      expect(configHelper.tokenId).toBe('0987654321');
    });
  });

  describe('override', () => {
    test('should be able to override config', () => {
      const ctx = { collectionFlow: { config: {} } } as CollectionFlowContextSchema;

      const configHelper = new ConfigHelper(ctx);

      configHelper.override({
        apiUrl: 'https://api.example.com',
        tokenId: '1234567890',
      });

      expect(configHelper.apiUrl).toBe('https://api.example.com');
      expect(configHelper.tokenId).toBe('1234567890');
      expect(ctx.collectionFlow?.config?.apiUrl).toBe('https://api.example.com');
      expect(ctx.collectionFlow?.config?.tokenId).toBe('1234567890');
      expect(ctx.collectionFlow?.config).toEqual({
        apiUrl: 'https://api.example.com',
        tokenId: '1234567890',
      });
    });
  });
});

import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { getCollectionFlowConfig } from './get-collection-flow-config';

describe('getCollectionFlowConfig', () => {
  it('should be defined', () => {
    expect(getCollectionFlowConfig).toBeDefined();
  });

  it('will return the config from the context', () => {
    const context = {
      collectionFlow: { config: { apiUrl: 'https://api.example.com' } },
    };

    const config = getCollectionFlowConfig(context as DefaultContextSchema);

    expect(config).toEqual({ apiUrl: 'https://api.example.com' });
  });

  it('will return undefined if the config is not present', () => {
    const context = {};

    const config = getCollectionFlowConfig(context as DefaultContextSchema);

    expect(config).toBeUndefined();
  });
});

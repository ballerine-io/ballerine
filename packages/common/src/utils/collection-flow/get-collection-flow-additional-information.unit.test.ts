import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { getCollectionFlowAdditionalInformation } from './get-collection-flow-additional-information';

describe('getCollectionFlowAdditionalInformation', () => {
  it('should be defined', () => {
    expect(getCollectionFlowAdditionalInformation).toBeDefined();
  });

  it('will return the additional information from the context', () => {
    const context = {
      collectionFlow: { additionalInformation: { customerCompany: 'Example Company' } },
    };

    const additionalInformation = getCollectionFlowAdditionalInformation(
      context as DefaultContextSchema,
    );

    expect(additionalInformation).toEqual({ customerCompany: 'Example Company' });
  });

  it('will return undefined if the additional information is not present', () => {
    const context = {};

    const additionalInformation = getCollectionFlowAdditionalInformation(
      context as DefaultContextSchema,
    );

    expect(additionalInformation).toBeUndefined();
  });
});

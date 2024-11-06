import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { getCollectionFlowState } from './get-collection-flow-state';

describe('getCollectionFlowState', () => {
  it('should be defined', () => {
    expect(getCollectionFlowState).toBeDefined();
  });

  it('will return the state from the context', () => {
    const context = {
      collectionFlow: { state: { customerCompany: 'Example Company' } },
    };

    const state = getCollectionFlowState(context as unknown as DefaultContextSchema);

    expect(state).toEqual({ customerCompany: 'Example Company' });
  });

  it('will return undefined if the state is not present', () => {
    const context = {};

    const state = getCollectionFlowState(context as DefaultContextSchema);

    expect(state).toBeUndefined();
  });
});

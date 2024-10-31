import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it } from 'vitest';
import { setCollectionFlowStatus } from './set-collection-flow-status';

describe('setCollectionFlowStatus', () => {
  it('should be defined', () => {
    expect(setCollectionFlowStatus).toBeDefined();
  });

  it('will set the status on the collection flow state', () => {
    const context = {
      collectionFlow: { state: { status: 'pending' } },
    };

    const updatedContext = setCollectionFlowStatus(context as DefaultContextSchema, 'completed');

    expect(updatedContext.collectionFlow?.state?.status).toBe('completed');
    expect(context.collectionFlow?.state?.status).toBe('completed');
    expect(updatedContext).toBe(context);
  });

  it('will throw an error if the status is invalid', () => {
    const context = {};

    expect(() =>
      setCollectionFlowStatus(context as DefaultContextSchema, 'invalid' as any),
    ).toThrow();
  });

  it('will throw an error if the collection flow state is not present', () => {
    const context = {};

    expect(() => setCollectionFlowStatus(context as DefaultContextSchema, 'completed')).toThrow();
  });
});

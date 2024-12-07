import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it, vi } from 'vitest';
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

  it('will log a warning if the status is invalid', () => {
    const context = {
      collectionFlow: { state: {} },
    };
    const consoleSpy = vi.spyOn(console, 'warn');

    const result = setCollectionFlowStatus(context as DefaultContextSchema, 'invalid' as any);

    expect(consoleSpy).toHaveBeenCalledWith('Invalid status: invalid');
    expect(result).toBe(context);
  });

  it('will log a warning if the collection flow state is not present', () => {
    const context = {};
    const consoleSpy = vi.spyOn(console, 'warn');

    const result = setCollectionFlowStatus(context as DefaultContextSchema, 'completed');

    expect(consoleSpy).toHaveBeenCalledWith('Collection flow state is not present.');
    expect(result).toBe(context);
  });
});

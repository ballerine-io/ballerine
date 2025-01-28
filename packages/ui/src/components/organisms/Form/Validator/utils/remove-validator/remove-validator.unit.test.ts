import { beforeEach, describe, expect, it, vi } from 'vitest';
import { removeValidator } from './remove-validator';

vi.mock('../../validators', () => ({
  validatorsExtends: {},
}));

describe('removeValidator', async () => {
  const validatorsExtends = vi.mocked(await import('../../validators')).validatorsExtends;

  beforeEach(() => {
    // Clear validators before each test
    Object.keys(validatorsExtends).forEach(key => {
      delete validatorsExtends[key];
    });
  });

  it('should remove validator from validatorsExtends', () => {
    // Setup
    const mockValidator = vi.fn();
    validatorsExtends['test'] = mockValidator;
    expect(validatorsExtends['test']).toBe(mockValidator);

    // Execute
    removeValidator('test');

    // Verify
    expect(validatorsExtends['test']).toBeUndefined();
  });

  it('should not throw error when removing non-existent validator', () => {
    expect(() => {
      removeValidator('nonexistent');
    }).not.toThrow();
  });

  it('should only remove specified validator', () => {
    // Setup
    const mockValidator1 = vi.fn();
    const mockValidator2 = vi.fn();
    validatorsExtends['test1'] = mockValidator1;
    validatorsExtends['test2'] = mockValidator2;

    // Execute
    removeValidator('test1');

    // Verify
    expect(validatorsExtends['test1']).toBeUndefined();
    expect(validatorsExtends['test2']).toBe(mockValidator2);
  });
});

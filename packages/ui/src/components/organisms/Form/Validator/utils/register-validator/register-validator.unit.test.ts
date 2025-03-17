import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validatorsExtends } from '../../validators';
import { registerValidator } from './register-validator';

vi.mock('../../validators', () => ({
  validatorsExtends: {},
}));

describe('registerValidator', () => {
  const mockValidator = vi.fn();
  const validatorType = 'test';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register validator to validatorsExtends', () => {
    registerValidator(validatorType, mockValidator);

    expect(validatorsExtends[validatorType]).toBe(mockValidator);
  });

  it('should return the registered validator', () => {
    const result = registerValidator(validatorType, mockValidator);

    expect(result).toBe(mockValidator);
  });
});

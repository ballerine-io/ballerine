import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ICommonValidator, TBaseValidators } from '../../types';
import { baseValidatorsMap, validatorsExtends } from '../../validators';
import { getValidator } from './get-validator';

vi.mock('../../validators', () => ({
  baseValidatorsMap: {},
  validatorsExtends: {},
}));

describe('getValidator', () => {
  const mockValidator = vi.fn();
  const validatorType = 'test';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validator from baseValidatorsMap if exists', () => {
    baseValidatorsMap[validatorType as TBaseValidators] = mockValidator;

    const result = getValidator({ type: validatorType } as unknown as ICommonValidator);

    expect(result).toBe(mockValidator);
  });

  it('should return validator from validatorsExtends if exists and not in baseValidatorsMap', () => {
    validatorsExtends[validatorType] = mockValidator;

    const result = getValidator({ type: validatorType } as unknown as ICommonValidator);

    expect(result).toBe(mockValidator);
  });

  it('should throw error if validator not found', () => {
    expect(() =>
      getValidator({ type: 'nonexistent' as TBaseValidators } as unknown as ICommonValidator),
    ).toThrow('Validator nonexistent not found.');
  });
});

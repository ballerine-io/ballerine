import { IRuleExecutionResult } from '@/components/organisms/Form/hooks';
import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../../../../types';
import { checkIfRequired } from './check-if-required';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules', () => ({
  executeRules: vi.fn(),
}));

describe('checkIfRequired', () => {
  const mockContext = { someContext: 'value' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when validate array is empty', () => {
    const element = {
      validate: [],
    } as unknown as IFormElement;

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(false);
  });

  it('should return false when no required validators exist', () => {
    const element = {
      validate: [
        { type: 'minLength', value: 5 },
        { type: 'maxLength', value: 10 },
      ],
    } as unknown as IFormElement;

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(false);
  });

  it('should return true when required validator exists without applyWhen rules', () => {
    const element = {
      validate: [{ type: 'required', value: true }],
    } as unknown as IFormElement;

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(true);
  });

  it('should return true when validator with considerRequred exists without applyWhen rules', () => {
    const element = {
      validate: [{ type: 'someType', considerRequred: true }],
    } as unknown as IFormElement;

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(true);
  });

  it('should use executeRules when applyWhen rules exist', () => {
    const element = {
      validate: [
        {
          type: 'required',
          applyWhen: [{ someRule: true }],
        },
      ],
    } as unknown as IFormElement;

    vi.mocked(executeRules).mockReturnValue([{ rule: {}, result: true }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, mockContext);

    expect(executeRules).toHaveBeenCalledWith(mockContext, [{ someRule: true }]);
    expect(result).toBe(true);
  });

  it('should return false when executeRules returns false', () => {
    const element = {
      validate: [
        {
          type: 'required',
          applyWhen: [{ someRule: true }],
        },
      ],
    } as unknown as IFormElement;

    vi.mocked(executeRules).mockReturnValue([
      { rule: {}, result: false },
    ] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(false);
  });

  it('should return true if any required validator is applicable', () => {
    const element = {
      validate: [
        {
          type: 'required',
          applyWhen: [{ rule1: true }],
        },
        {
          type: 'required',
          applyWhen: [{ rule2: true }],
        },
      ],
    } as unknown as IFormElement;

    vi.mocked(executeRules)
      .mockReturnValueOnce([{ rule: {}, result: false }] as IRuleExecutionResult[])
      .mockReturnValueOnce([{ rule: {}, result: true }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, mockContext);

    expect(result).toBe(true);
  });
});

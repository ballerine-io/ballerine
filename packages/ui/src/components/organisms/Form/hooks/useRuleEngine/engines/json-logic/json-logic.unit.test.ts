import jsonLogic from 'json-logic-js';
import { describe, expect, it, vi } from 'vitest';
import { TRuleEngine } from '../../types';
import { jsonLogicEngineRunner } from './json-logic';

vi.mock('json-logic-js', () => ({
  default: {
    apply: vi.fn(),
  },
}));

describe('jsonLogicEngineRunner', () => {
  const mockContext = { foo: 'bar' };
  const mockRule = {
    engine: 'json-logic' as TRuleEngine,
    value: { some: 'logic' },
  };

  it('should throw error if rule value is not an object', () => {
    expect(() =>
      jsonLogicEngineRunner(mockContext, { ...mockRule, value: 'not-an-object' }),
    ).toThrow('JsonLogicEngineRunner: Rule value must be an object');

    expect(() => jsonLogicEngineRunner(mockContext, { ...mockRule, value: null })).toThrow(
      'JsonLogicEngineRunner: Rule value must be an object',
    );
  });

  it('should call jsonLogic.apply with correct parameters', () => {
    jsonLogicEngineRunner(mockContext, mockRule);
    expect(jsonLogic.apply).toHaveBeenCalledWith(mockRule.value, mockContext);
  });

  it('should return true when jsonLogic returns truthy value', () => {
    vi.mocked(jsonLogic.apply).mockReturnValue(1);
    const result = jsonLogicEngineRunner(mockContext, mockRule);
    expect(result).toBe(true);
  });

  it('should return false when jsonLogic returns falsy value', () => {
    vi.mocked(jsonLogic.apply).mockReturnValue(0);
    const result = jsonLogicEngineRunner(mockContext, mockRule);
    expect(result).toBe(false);
  });

  it('should log warning when result is not boolean', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    vi.mocked(jsonLogic.apply).mockReturnValue(1);

    jsonLogicEngineRunner(mockContext, mockRule);

    expect(consoleSpy).toHaveBeenCalledWith(
      'JsonLogicEngineRunner: Rule result is not a boolean',
      1,
    );
    expect(consoleSpy).toHaveBeenCalledWith('Result will be converted to boolean');
  });
});

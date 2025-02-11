import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRuleEngineRunner } from '../../rule-engine.repository';
import { IRule } from '../../types';
import { executeRule } from './execute-rule';

vi.mock('../../rule-engine.repository', () => ({
  getRuleEngineRunner: vi.fn(),
}));

describe('executeRule', () => {
  const mockContext = { foo: 'bar' };
  const mockRule: IRule = {
    engine: 'json-logic',
    value: {},
  };
  const mockRunEngine = vi.fn();

  beforeEach(() => {
    vi.mocked(getRuleEngineRunner).mockReturnValue(mockRunEngine);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get the correct rule engine runner', () => {
    executeRule(mockContext, mockRule);
    expect(getRuleEngineRunner).toHaveBeenCalledWith(mockRule.engine);
  });

  it('should execute the rule engine with correct parameters', () => {
    executeRule(mockContext, mockRule);
    expect(mockRunEngine).toHaveBeenCalledWith(mockContext, mockRule);
  });

  it('should return the result from the rule engine', () => {
    const expectedResult = true;
    mockRunEngine.mockReturnValue(expectedResult);

    const result = executeRule(mockContext, mockRule);
    expect(result).toBe(expectedResult);
  });
});

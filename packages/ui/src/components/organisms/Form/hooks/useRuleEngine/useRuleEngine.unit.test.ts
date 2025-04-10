import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IRule, IRuleExecutionResult } from './types';
import { useRuleEngine } from './useRuleEngine';
import { executeRules } from './utils/execute-rules';

vi.mock('./utils/execute-rules', () => ({
  executeRules: vi.fn(),
}));

describe('useRuleEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute rules synchronously when executeRulesSync is true', () => {
    // Arrange
    const context = { foo: 'bar' };
    const rules: IRule[] = [{ engine: 'json-logic', value: true }];
    const expectedResults: IRuleExecutionResult[] = [{ rule: rules[0] as IRule, result: true }];

    vi.mocked(executeRules).mockReturnValue(expectedResults);

    // Act
    const { result } = renderHook(() => useRuleEngine(context, { rules, executeRulesSync: true }));

    // Assert
    expect(result.current).toEqual(expectedResults);
    expect(executeRules).toHaveBeenCalledWith(context, rules);
  });
  it('should execute rules asynchronously when executeRulesSync is false', async () => {
    // Arrange
    const context = { foo: 'bar' };
    const rules: IRule[] = [{ engine: 'json-logic', value: true }];
    const expectedResults: IRuleExecutionResult[] = [{ rule: rules[0] as IRule, result: true }];

    vi.mocked(executeRules).mockReturnValue(expectedResults);

    // Act
    const { result, rerender } = renderHook(() =>
      useRuleEngine(context, { rules, executeRulesSync: false }),
    );

    // Assert initial empty state
    expect(result.current).toEqual([]);

    // Manually trigger the debounced function
    vi.runAllTimers();

    // Trigger a rerender after running all timers
    rerender();

    // Need to wait for the state update to be applied
    await waitFor(() => {
      expect(result.current).toEqual(expectedResults);
    });

    expect(executeRules).toHaveBeenCalledWith(context, rules);
  });

  it('should execute rules on initialize when runOnInitialize is true', () => {
    // Arrange
    const context = { foo: 'bar' };
    const rules: IRule[] = [{ engine: 'json-logic', value: true }];
    const expectedResults: IRuleExecutionResult[] = [{ rule: rules[0] as IRule, result: true }];

    vi.mocked(executeRules).mockReturnValue(expectedResults);

    // Act
    const { result } = renderHook(() => useRuleEngine(context, { rules, runOnInitialize: true }));

    // Assert
    expect(result.current).toEqual(expectedResults);
    expect(executeRules).toHaveBeenCalledWith(context, rules);
  });

  it('should convert single rule to array', () => {
    // Arrange
    const context = { foo: 'bar' };
    const rule: IRule = { engine: 'json-logic', value: true };
    const expectedResults: IRuleExecutionResult[] = [{ rule, result: true }];

    vi.mocked(executeRules).mockReturnValue(expectedResults);

    // Act
    const { result } = renderHook(() =>
      useRuleEngine(context, { rules: rule, executeRulesSync: true }),
    );

    // Assert
    expect(result.current).toEqual(expectedResults);
    expect(executeRules).toHaveBeenCalledWith(context, [rule]);
  });
  it('should use custom execution delay', async () => {
    // Arrange
    const context = { foo: 'bar' };
    const rules: IRule[] = [{ engine: 'json-logic', value: true }];
    const customDelay = 1000;
    const expectedResults: IRuleExecutionResult[] = [{ rule: rules[0] as IRule, result: true }];

    vi.mocked(executeRules).mockReturnValue(expectedResults);

    // Act
    const { result, rerender } = renderHook(() =>
      useRuleEngine(context, { rules, executeRulesSync: false, executionDelay: customDelay }),
    );

    // Assert initial empty state
    expect(result.current).toEqual([]);

    // Run all timers instead of advancing by time
    vi.runAllTimers();

    // Trigger a rerender after running all timers
    rerender();

    // Need to wait for the state update to be applied
    await waitFor(() => {
      expect(result.current).toEqual(expectedResults);
    });

    expect(executeRules).toHaveBeenCalledWith(context, rules);
  });
});

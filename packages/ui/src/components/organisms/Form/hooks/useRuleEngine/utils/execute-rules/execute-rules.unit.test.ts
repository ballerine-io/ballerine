import { describe, expect, it, vi } from 'vitest';
import { executeRule } from '../execute-rule';
import { executeRules } from './execute-rules';

vi.mock('../execute-rule', () => ({
  executeRule: vi.fn(),
}));

describe('executeRules', () => {
  it('should execute each rule and return array of results', () => {
    // Arrange
    const context = { foo: 'bar' };
    const rules = [
      { engine: 'json-logic', value: true },
      { engine: 'json-schema', value: false },
    ];

    const mockResults = [true, false];
    mockResults.forEach((result, index) => {
      (executeRule as any).mockReturnValueOnce(result);
    });

    // Act
    const results = executeRules(context, rules);

    // Assert
    expect(results).toEqual([
      { rule: rules[0], result: true },
      { rule: rules[1], result: false },
    ]);

    expect(executeRule).toHaveBeenCalledTimes(2);
    expect(executeRule).toHaveBeenNthCalledWith(1, context, rules[0]);
    expect(executeRule).toHaveBeenNthCalledWith(2, context, rules[1]);
  });
});

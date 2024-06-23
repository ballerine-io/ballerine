import { validateRuleSet } from './rule-engine';
import { FailedRuleResult, RuleSet, RuleResultSet, RuleResult, TOperator } from './types';
import { OPERATION, OPERATOR } from './operators/enums';
import {
  OperationNotFoundError,
  DataValueNotFoundError,
  MissingKeyError,
  ValidationFailedError,
} from './errors';
import exp from 'constants';

const mockData = {
  country: 'US',
  name: 'John',
  age: 35,
};

describe('Rule Engine', () => {
  it('should validate a simple rule set', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
        {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'name',
              operation: OPERATION.EQUALS,
              value: 'John',
            },
            {
              key: 'age',
              operation: OPERATION.GT,
              value: 30,
            },
            {
              operator: OPERATOR.OR,
              rules: [
                {
                  key: 'age',
                  operation: OPERATION.GT,
                  value: 30,
                },
                {
                  key: 'age',
                  operation: OPERATION.LT,
                  value: 40,
                },
              ],
            },
          ],
        },
      ],
    };

    const validationResults: RuleResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('PASSED');
    expect((validationResults[0] as RuleResult).passed).toBe(true);
    expect(validationResults[1]!.status).toBe('PASSED');
    const nestedResults = (validationResults[1] as RuleResult).message;
    expect(nestedResults).toContain('PASSED');
  });

  it('should handle missing key in rule', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'nonexistent',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const validationResults: RuleResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toBe(
      'Field nonexistent is missing or null',
    );
    expect((validationResults[0] as RuleResult).passed).toBe(false);
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(DataValueNotFoundError);
  });

  it('should throw an error for unknown operation', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          // @ts-ignore - intentionally using an unknown operation
          operation: 'UNKNOWN',
          value: 'US',
        },
      ],
    };

    const result = validateRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(OperationNotFoundError),
      message: 'Unknown operation UNKNOWN',
      passed: false,
      rule: {
        key: 'country',
        operation: 'UNKNOWN',
        value: 'US',
      },
      status: 'FAILED',
    });
  });

  it('should fail for incorrect value', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operation: OPERATION.EQUALS,
          value: 'CA',
        },
      ],
    };

    const validationResults: RuleResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).passed).toBe(false);
    expect((validationResults[0] as RuleResult).error).toBe(undefined);
  });

  it.skip('should validate custom operation with additional params', () => {
    // TODO: should spy Date.now() to return a fixed date
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'createdAt',
          operation: OPERATION.LAST_YEAR,
          value: { years: 2 },
        },
      ],
    };

    const validationResults: RuleResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('PASSED');
    expect((validationResults[0] as RuleResult).passed).toBe(true);
  });

  it('should fail custom operation with missing additional params', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'age',
          operation: OPERATION.LAST_YEAR,
          value: { years: 'two' }, // Invalid type for years
        },
      ],
    };

    const validationResults: RuleResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toContain(
      `Validation failed for 'LAST_YEAR', message: Invalid condition value`,
    );
    expect((validationResults[0] as RuleResult).passed).toBe(false);
  });

  it('should throw MissingKeyError when rule is missing key field', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: '',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const result = validateRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(MissingKeyError),
      message: 'Rule is missing the key field',
      passed: false,
      rule: {
        key: '',
        operation: 'EQUALS',
        value: 'US',
      },
      status: 'FAILED',
    });
  });
});

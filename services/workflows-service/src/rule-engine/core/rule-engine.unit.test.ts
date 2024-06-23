import { RuleSet, ValidationResultSet } from './types';
import { OperationNotFoundError, DataValueNotFoundError } from './errors';
import { OPERATOR, OPERATION } from './operators/enums';
import { validateRuleSet } from './rule-engine';

const mockData = {
  country: 'US',
  name: 'John',
  age: 35,
};

describe('Rule Engine', () => {
  it('should validate a simple rule set', () => {
    const ruleSetExample: RuleSet = {
      operator: 'or',
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

    const validationResults: ValidationResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults.country.status).toBe('PASSED');
    expect(validationResults.country.passed).toBe(true);
    expect(validationResults.name.status).toBe('PASSED');
    expect(validationResults.name.passed).toBe(true);
    expect(validationResults.age.status).toBe('PASSED');
    expect(validationResults.age.passed).toBe(true);
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

    const validationResults: ValidationResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults.nonexistent.status).toBe('FAILED');
    expect(validationResults.nonexistent.message).toBe('Field nonexistent is missing or null');
    expect(validationResults.nonexistent.passed).toBe(false);
  });

  it('should throw an error for unknown operation', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operation: 'UNKNOWN' as CONDITION_TYPE,
          value: 'US',
        },
      ],
    };

    expect(() => validateRuleSet(ruleSetExample, mockData)).toThrowError(OperationNotFoundError);
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

    const validationResults: ValidationResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults.country.status).toBe('FAILED');
    expect(validationResults.country.passed).toBe(false);
  });

  it('should validate custom operation with additional params', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'age',
          operation: OPERATION.LAST_YEAR,
          value: { years: 2 },
        },
      ],
    };

    const validationResults: ValidationResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults.age.status).toBe('PASSED');
    expect(validationResults.age.passed).toBe(true);
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

    const validationResults: ValidationResultSet = validateRuleSet(ruleSetExample, mockData);
    expect(validationResults.age.status).toBe('FAILED');
    expect(validationResults.age.message).toContain(
      'Validation failed for age with operation LAST_YEAR',
    );
    expect(validationResults.age.passed).toBe(false);
  });
});

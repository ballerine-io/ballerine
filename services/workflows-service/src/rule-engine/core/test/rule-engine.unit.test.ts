import {
  DataValueNotFoundError,
  MissingKeyError,
  OPERATION,
  OPERATOR,
  OperatorNotFoundError,
  RuleEngine,
  RuleResult,
  RuleResultSet,
  RuleSet,
  runRuleSet,
} from '@ballerine/common';
import z from 'zod';
import { amlContext, context } from './data-helper';

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
          operator: OPERATION.EQUALS,
          value: 'US',
        },
        {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'name',
              operator: OPERATION.EQUALS,
              value: 'John',
            },
            {
              operator: OPERATOR.OR,
              rules: [
                {
                  key: 'age',
                  operator: OPERATION.GT,
                  value: 40,
                },
                {
                  key: 'age',
                  operator: OPERATION.LTE,
                  value: 35,
                },
              ],
            },
          ],
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(2);

    expect(validationResults[0]!.status).toBe('PASSED');

    expect(validationResults[1]!.status).toBe('PASSED');
  });

  it('should handle missing key in rule', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'nonexistent',
          operator: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toBe(
      'Field nonexistent is missing or null',
    );
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(DataValueNotFoundError);
  });

  it('should throw an error for unknown operator', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          // @ts-ignore - intentionally using an unknown operator
          operator: 'UNKNOWN',
          // @ts-ignore - intentionally using an unknown operator
          value: 'US',
        },
      ],
    };

    const result = runRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(OperatorNotFoundError),
      message: 'Unknown operator UNKNOWN',
      rule: {
        key: 'country',
        operator: 'UNKNOWN',
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
          operator: OPERATION.EQUALS,
          value: 'CA',
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).error).toBe(undefined);
  });

  it.skip('should validate custom operator with additional params', () => {
    // TODO: should spy Date.now() to return a fixed date
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'createdAt',
          operator: OPERATION.LAST_YEAR,
          value: { years: 2 },
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail custom operator with missing additional params', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'age',
          operator: OPERATION.LAST_YEAR,
          // @ts-ignore - wrong type
          value: { years: 'two' },
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toContain(
      `Validation failed for 'LAST_YEAR', message: Invalid condition value`,
    );
  });

  it('should throw MissingKeyError when rule is missing key field', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: '',
          operator: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const result = runRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(MissingKeyError),
      message: 'Rule is missing the key field',
      rule: {
        key: '',
        operator: 'EQUALS',
        value: 'US',
      },
      status: 'FAILED',
    });
  });

  it('should resolve a nested property from context', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.businessInformation.data[0].establishDate',
          operator: OPERATION.LAST_YEAR,
          value: { years: 1 },
        },
      ],
    };

    const engine = RuleEngine(ruleSetExample);
    let result = engine.run(context);

    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "rule": {
          "key": "pluginsOutput.businessInformation.data[0].establishDate",
          "operator": "LAST_YEAR",
          "value": {
            "years": 1,
          },
        },
        "status": "PASSED",
      }
    `);

    const context2 = JSON.parse(JSON.stringify(context));

    // @ts-ignore
    context2.pluginsOutput.businessInformation.data[0].establishDate = '2020-01-01';

    result = engine.run(context2 as any);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "rule": {
          "key": "pluginsOutput.businessInformation.data[0].establishDate",
          "operator": "LAST_YEAR",
          "value": {
            "years": 1,
          },
        },
        "status": "FAILED",
      }
    `);
  });

  describe('exists operator', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operator: OPERATION.EXISTS,
            // @ts-ignore - wrong type
            value: {},
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operator": "EXISTS",
            "value": {},
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = [];

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operator": "EXISTS",
            "value": {},
          },
          "status": "FAILED",
        }
      `);

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operator": "EXISTS",
            "value": {},
          },
          "status": "FAILED",
        }
      `);

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operator": "EXISTS",
            "value": {},
          },
          "status": "PASSED",
        }
      `);
    });

    it('should check with schema', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operator: OPERATION.EXISTS,
            // @ts-expect-error - schema
            value: {
              schema: z.object({
                item: z.coerce.number().int().positive(),
              }),
            },
          },
        ],
      };

      const context2 = JSON.parse(JSON.stringify(context));

      const engine = RuleEngine(ruleSetExample);

      let result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('FAILED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('PASSED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.status).toBe('FAILED');
    });
  });

  describe('not_equals operator', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.companySanctions.data.length',
            operator: OPERATION.NOT_EQUALS,
            value: 0,
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.companySanctions.data.length",
            "operator": "NOT_EQUALS",
            "value": 0,
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.pluginsOutput.companySanctions.data = [];

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.companySanctions.data.length",
            "operator": "NOT_EQUALS",
            "value": 0,
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('in operator', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operator: OPERATION.IN,
            value: ['IL', 'AF', 'US', 'GB'],
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operator": "IN",
            "value": [
              "IL",
              "AF",
              "US",
              "GB",
            ],
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.entity.data.country = 'CA';

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operator": "IN",
            "value": [
              "IL",
              "AF",
              "US",
              "GB",
            ],
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('not_in operator', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operator: OPERATION.NOT_IN,
            value: ['IL', 'CA', 'US', 'GB'],
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operator": "NOT_IN",
            "value": [
              "IL",
              "CA",
              "US",
              "GB",
            ],
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.entity.data.country = 'CA';

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operator": "NOT_IN",
            "value": [
              "IL",
              "CA",
              "US",
              "GB",
            ],
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('aml operator', () => {
    it('should resolve a nested property from context', () => {
      const amlContext2 = {
        ...(JSON.parse(JSON.stringify(context)) as any),
        ...amlContext,
      };

      const warningRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'warnings.length',
            operator: OPERATION.AML_CHECK,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      let engine = RuleEngine(warningRule);
      let result = engine.run(amlContext2);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot();
    });

    it('should resolve a nested property from context', () => {
      const amlContext2 = {
        ...(JSON.parse(JSON.stringify(context)) as any),
        ...amlContext,
      };

      const warningRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'warnings.length',
            operator: OPERATION.AML_CHECK,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      let engine = RuleEngine(warningRule);
      let result = engine.run(amlContext2);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot();

      const adverseMediaRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'adverseMedia.length',
            operator: OPERATION.AML_CHECK,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = RuleEngine(adverseMediaRule);
      result = engine.run(amlContext2);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot();

      const fitnessProbityRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'fitnessProbity.length',
            operator: OPERATION.AML_CHECK,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = RuleEngine(fitnessProbityRule);
      result = engine.run(amlContext2);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot();

      const pepRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pep.length',
            operator: OPERATION.AML_CHECK,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = RuleEngine(pepRule);
      result = engine.run(amlContext2);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot();
    });
  });
});

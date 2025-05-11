import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import {
  DataValueNotFoundError,
  OPERATION,
  OPERATOR,
  RuleResult,
  RuleResultSet,
  RuleSet,
} from '@ballerine/common';
import z from 'zod';
import { createRuleEngine, runRuleSet } from '../rule-engine';
import { amlContext, context, helpers, ubosMismatchContext } from './data-helper';

const mockData = {
  country: 'US',
  name: 'John',
  age: 35,
  createdAt: new Date().toISOString(),
};

const options = {
  unifiedApiClient: new UnifiedApiClient(),
  helpers,
};

describe('Rule Engine', () => {
  it('should validate a simple rule set', async () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operator: OPERATION.EQUALS,
          value: 'US',
          isPathComparison: false,
        },
        {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'name',
              operator: OPERATION.EQUALS,
              value: 'John',
              isPathComparison: false,
            },
            {
              operator: OPERATOR.OR,
              rules: [
                {
                  key: 'age',
                  operator: OPERATION.GT,
                  value: 40,
                  isPathComparison: false,
                },
                {
                  key: 'age',
                  operator: OPERATION.LTE,
                  value: 35,
                  isPathComparison: false,
                },
              ],
            },
          ],
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSetExample).run(
      mockData,
      helpers,
    );

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(2);

    expect(validationResults[0]!.status).toBe('PASSED');

    expect(validationResults[1]!.status).toBe('PASSED');
  });

  it('should handle missing key in rule', async () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'nonexistent',
          operator: OPERATION.EQUALS,
          value: 'US',
          isPathComparison: false,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSetExample).run(
      mockData,
      helpers,
    );
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toBe(
      'Field nonexistent is missing or null',
    );
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(DataValueNotFoundError);
  });

  it('should throw an error for unknown operator', async () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          // @ts-ignore - intentionally using an unknown operator
          operator: 'UNKNOWN',
          // @ts-ignore - intentionally using an unknown operator
          value: 'US',
          isPathComparison: false,
        },
      ],
    };

    const result = await createRuleEngine(ruleSetExample).run(mockData, helpers);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]?.message).toMatch(
      /^Validation failed for 'rule', message: parsing failed, error.*"name": "ZodError"/s,
    );
  });

  it('should fail for incorrect value', async () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operator: OPERATION.EQUALS,
          value: 'CA',
          isPathComparison: false,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSetExample).run(
      mockData,
      helpers,
    );
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).error).toBe(undefined);
  });

  it('should validate custom operator with additional params', async () => {
    // TODO: should spy Date.now() to return a fixed date
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'createdAt',
          operator: OPERATION.LAST_YEAR,
          value: { years: 1 },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSetExample).run(
      mockData,
      helpers,
    );
    expect(validationResults[0]).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "rule": {
          "key": "createdAt",
          "operator": "LAST_YEAR",
          "value": {
            "years": 1,
          },
        },
        "status": "PASSED",
      }
    `);
  });

  it('should fail custom operator with missing additional params', async () => {
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

    const validationResults: RuleResultSet = await createRuleEngine(ruleSetExample).run(
      mockData,
      helpers,
    );
    expect(validationResults[0]?.message).toMatchInlineSnapshot(`
      "Validation failed for 'rule', message: parsing failed, error: {
        "issues": [
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "string",
            "path": [
              "value",
              "years"
            ],
            "message": "Expected number, received string"
          }
        ],
        "name": "ZodError"
      }"
    `);
  });

  it('should throw DataValueNotFoundError when rule is missing key field', async () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: '',
          operator: OPERATION.EQUALS,
          value: 'US',
          isPathComparison: false,
        },
      ],
    };

    const result = await createRuleEngine(ruleSetExample).run(mockData, helpers);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "error": [DataValueNotFoundError: Field  is missing or null],
        "message": "Field  is missing or null",
        "rule": {
          "isPathComparison": false,
          "key": "",
          "operator": "EQUALS",
          "value": "US",
        },
        "status": "FAILED",
      }
    `);
  });

  it('should resolve a nested property from context', async () => {
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

    const engine = createRuleEngine(ruleSetExample);
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    if (context.pluginsOutput?.businessInformation?.data?.[0]) {
      context.pluginsOutput.businessInformation.data[0].establishDate = sixMonthsAgo
        .toISOString()
        .split('T')[0] as string;
    }

    let result = await engine.run(context, helpers);

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

    result = await engine.run(context2 as any, helpers);
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

  it('should evaluate to true if establishDate is within the last year', async () => {
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

    const engine = createRuleEngine(ruleSetExample);

    // Test with a date from 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const context1 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: sixMonthsAgo.toISOString() }],
        },
      },
    };

    let result = await engine.run(context1, helpers);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from 11 months ago
    const elevenMonthsAgo = new Date();
    elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
    const context2 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: elevenMonthsAgo.toISOString() }],
        },
      },
    };

    result = await engine.run(context2, helpers);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from exactly one year ago (edge case)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const context3 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: oneYearAgo.toISOString() }],
        },
      },
    };

    result = await engine.run(context3, helpers);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from 13 months ago (should fail)
    const thirteenMonthsAgo = new Date();
    thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);
    const context4 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: thirteenMonthsAgo.toISOString() }],
        },
      },
    };

    result = await engine.run(context4, helpers);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('FAILED');
  });

  describe('EXISTS operator - not in use', () => {
    it('should resolve a nested property from context', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operator: OPERATION.EXISTS,
            value: {
              schema: z.object({}),
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      let result = await engine.run(context, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);

      expect(result[0]?.status).toMatchInlineSnapshot(`"FAILED"`);
      expect(result[0]?.message).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);

      const context2 = JSON.parse(JSON.stringify(context)) as any;

      context2.pluginsOutput.businessInformation.data[0].shares = [];

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toMatchInlineSnapshot(`"FAILED"`);
      expect(result[0]?.message).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);

      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toMatchInlineSnapshot(`"FAILED"`);
      expect(result[0]?.message).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);

      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toMatchInlineSnapshot(`"PASSED"`);
      expect(result[0]?.message).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);
    });

    it('should check with schema', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operator: OPERATION.EXISTS,
            value: {
              schema: z.object({
                item: z.coerce.number().int().positive(),
              }),
            },
          },
        ],
      };

      const context2 = JSON.parse(JSON.stringify(context));

      const engine = createRuleEngine(ruleSetExample);

      let result = await engine.run(context2 as any, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('FAILED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = await engine.run(context2 as any, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('PASSED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = await engine.run(context2 as any, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.status).toBe('FAILED');
    });
  });

  describe('NOT_EQUALS operator', () => {
    it('should resolve a nested property from context', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.companySanctions.data.length',
            operator: OPERATION.NOT_EQUALS,
            value: 0,
            isPathComparison: false,
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      let result = await engine.run(context, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
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

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
            "key": "pluginsOutput.companySanctions.data.length",
            "operator": "NOT_EQUALS",
            "value": 0,
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('IN operator', () => {
    it('should resolve a nested property from context', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operator: OPERATION.IN,
            value: ['IL', 'AF', 'US', 'GB'],
            isPathComparison: false,
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      let result = await engine.run(context, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
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

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
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

  describe('IN_CASE_INSENSITIVE operator', () => {
    it('should correctly evaluate when using a string property', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'country',
            operator: OPERATION.IN_CASE_INSENSITIVE,
            value: ['us', 'ca'],
            isPathComparison: false,
          },
        ],
      };

      const data = { country: 'US' };

      let validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('PASSED');

      data.country = 'Ca';
      validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('PASSED');

      data.country = 'GB';
      validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('FAILED');
    });

    it('should correctly evaluate when using a string array property', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'countries',
            operator: OPERATION.IN_CASE_INSENSITIVE,
            value: ['us', 'ca'],
            isPathComparison: false,
          },
        ],
      };

      const data = { countries: ['US'] };

      let validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('PASSED');

      data.countries = ['Ca'];
      validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('PASSED');

      data.countries = ['GB'];
      validationResults = await runRuleSet(ruleSetExample, data, options);
      expect(validationResults[0]!.status).toBe('FAILED');
    });
  });

  describe('not_in operator', () => {
    it('should resolve a nested property from context', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operator: OPERATION.NOT_IN,
            value: ['IL', 'CA', 'US', 'GB'],
            isPathComparison: false,
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      let result = await engine.run(context, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
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

      result = await engine.run(context2 as any, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": false,
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
    describe('warning section', () => {
      it('should resolve a nested property from context', async () => {
        const amlContextHasData = {
          ...(JSON.parse(JSON.stringify(context)) as any),
          ...(JSON.parse(JSON.stringify(amlContext)) as any),
          example_id_002: JSON.parse(
            JSON.stringify(amlContext.childWorkflows.kyc_email_session_example.example_id_001),
          ) as any,
        };

        const warningRule: RuleSet = {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'warnings.length',
              operator: OPERATION.AML_CHECK,
              value: {
                childWorkflowName: 'kyc_email_session_example',
                operator: OPERATION.GTE,
                value: 1,
              },
            },
          ],
        };

        const engine = createRuleEngine(warningRule);

        amlContextHasData.childWorkflows.kyc_email_session_example.example_id_001.result.vendorResult.aml =
          {
            hits: [],
          };

        const result = await engine.run(amlContextHasData, helpers);

        expect(result).toBeDefined();
        expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": [DataValueNotFoundError: Field warnings.length is missing or null],
            "message": "Field warnings.length is missing or null",
            "rule": {
              "key": "warnings.length",
              "operator": "AML_CHECK",
              "value": {
                "childWorkflowName": "kyc_email_session_example",
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "FAILED",
          }
        `);
      });

      it('should failed when no data', async () => {
        const amlContextHasData = {
          ...(JSON.parse(JSON.stringify(context)) as any),
          ...(JSON.parse(JSON.stringify(amlContext)) as any),
        };

        const warningRule: RuleSet = {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'warnings.length',
              operator: OPERATION.AML_CHECK,
              value: {
                childWorkflowName: 'kyc_email_session_example',
                operator: OPERATION.GTE,
                value: 1,
              },
            },
          ],
        };

        const engine = createRuleEngine(warningRule);
        const result = await engine.run(amlContextHasData, helpers);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "warnings.length",
              "operator": "AML_CHECK",
              "value": {
                "childWorkflowName": "kyc_email_session_example",
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "PASSED",
          }
        `);
      });
    });

    it('should resolve fitness probity', async () => {
      const amlContextHasData = {
        ...(JSON.parse(JSON.stringify(context)) as any),
        ...(JSON.parse(JSON.stringify(amlContext)) as any),
      };

      const fitnessProbityRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'fitnessProbity.length',
            operator: OPERATION.AML_CHECK,
            value: {
              childWorkflowName: 'kyc_email_session_example',
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      amlContextHasData.childWorkflows.kyc_email_session_example.example_id_001.result.vendorResult.aml =
        {
          hits: [
            {
              fitnessProbity: [
                {
                  date: null,
                  sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                  sourceName:
                    'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                },
              ],
            },
          ],
        };

      const engine = createRuleEngine(fitnessProbityRule);
      const result = await engine.run(amlContextHasData, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "fitnessProbity.length",
            "operator": "AML_CHECK",
            "value": {
              "childWorkflowName": "kyc_email_session_example",
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "PASSED",
        }
      `);
    });

    it('should resolve a nested property from context', async () => {
      const amlContext2 = {
        ...(JSON.parse(JSON.stringify(context)) as any),
        ...(JSON.parse(JSON.stringify(amlContext)) as any),
      };

      const warningRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'warnings.length',
            operator: OPERATION.AML_CHECK,
            value: {
              childWorkflowName: 'kyc_email_session_example',
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      amlContext2.childWorkflows.kyc_email_session_example.example_id_001.result.vendorResult.aml =
        {
          hits: [
            {
              warnings: [
                {
                  date: null,
                  sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                  sourceName:
                    'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                },
              ],
            },
          ],
        };

      let engine = createRuleEngine(warningRule);
      let result = await engine.run(amlContext2, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "warnings.length",
            "operator": "AML_CHECK",
            "value": {
              "childWorkflowName": "kyc_email_session_example",
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "PASSED",
        }
      `);

      const adverseMediaRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'adverseMedia.length',
            operator: OPERATION.AML_CHECK,
            value: {
              childWorkflowName: 'kyc_email_session_example',
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = createRuleEngine(adverseMediaRule);
      result = await engine.run(amlContext2, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "adverseMedia.length",
            "operator": "AML_CHECK",
            "value": {
              "childWorkflowName": "kyc_email_session_example",
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "FAILED",
        }
      `);

      const fitnessProbityRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'fitnessProbity.length',
            operator: OPERATION.AML_CHECK,
            value: {
              childWorkflowName: 'kyc_email_session_example',
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = createRuleEngine(fitnessProbityRule);
      result = await engine.run(amlContext2, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "fitnessProbity.length",
            "operator": "AML_CHECK",
            "value": {
              "childWorkflowName": "kyc_email_session_example",
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "FAILED",
        }
      `);

      const pepRule: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pep.length',
            operator: OPERATION.AML_CHECK,
            value: {
              childWorkflowName: 'kyc_email_session_example',
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      engine = createRuleEngine(pepRule);
      result = await engine.run(amlContext2, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pep.length",
            "operator": "AML_CHECK",
            "value": {
              "childWorkflowName": "kyc_email_session_example",
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('Path comparison', () => {
    it('should compare values from two different paths', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].companyName',
            operator: OPERATION.NOT_EQUALS,
            value: 'entity.data.companyName',
            isPathComparison: true,
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(context, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "isPathComparison": true,
            "key": "pluginsOutput.businessInformation.data[0].companyName",
            "operator": "NOT_EQUALS",
            "value": "entity.data.companyName",
          },
          "status": "PASSED",
        }
      `);
    });

    it('should handle invalid paths', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].companyName',
            operator: OPERATION.NOT_EQUALS,
            value: 'entity.invalid.path',
            isPathComparison: true,
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(context, helpers);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": [DataValueNotFoundError: Field entity.invalid.path is missing or null],
          "message": "Field entity.invalid.path is missing or null",
          "rule": {
            "isPathComparison": true,
            "key": "pluginsOutput.businessInformation.data[0].companyName",
            "operator": "NOT_EQUALS",
            "value": "entity.invalid.path",
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('UBO match operator', () => {
    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'uboMismatch',
          operator: OPERATION.UBO_MISMATCH,
          value: 1,
          isPathComparison: false,
        },
      ],
    };

    const createRegistryUbo = (
      name: string,
    ): (typeof ubosMismatchContext)['pluginsOutput']['ubo']['data']['nodes'][0] => ({
      id: 'random-id',
      data: {
        name,
        type: 'PERSON',
        sharePercentage: 10,
      },
    });

    const createCollectionUbo = (
      firstName: string,
      lastName: string,
    ): (typeof ubosMismatchContext)['entity']['data']['additionalInfo']['ubos'][0] => ({
      firstName,
      lastName,
      city: 'Tel-Aviv',
      role: 'Role',
      email: 'example@ballerine.com',
      phone: '12121121221',
      street: 'Lincoln 20',
      country: 'IL',
      sourceOfFunds: 'Ballerine',
      sourceOfWealth: 'Ballerine',
      ballerineEntityId: 'cm8houie1000drt0knmynbu98',
      ownershipPercentage: 10,
    });

    const adjustContext = (
      registryUbos: (typeof ubosMismatchContext)['pluginsOutput']['ubo']['data']['nodes'],
      collectionUbos: (typeof ubosMismatchContext)['entity']['data']['additionalInfo']['ubos'],
    ): typeof ubosMismatchContext => {
      // replace registry ubos with the new ones without changing the original context
      const newContext = JSON.parse(
        JSON.stringify(ubosMismatchContext),
      ) as typeof ubosMismatchContext;
      newContext.pluginsOutput.ubo.data.nodes = registryUbos;
      newContext.entity.data.additionalInfo.ubos = collectionUbos;

      return newContext;
    };

    const expectResult = (result: RuleResult[], status: 'PASSED' | 'FAILED') => {
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe(status);
    };

    it('should extact-match happy flow', async () => {
      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(ubosMismatchContext, helpers);
      expectResult(result, 'FAILED');
    });

    it('should fail when UBOs names match exactly regardless of order', async () => {
      const engine = createRuleEngine(ruleSet);
      const modifiedContexts = [
        adjustContext(
          [createRegistryUbo('John Doe'), createRegistryUbo('Jane Smith')],
          [createCollectionUbo('John', 'Doe'), createCollectionUbo('Jane', 'Smith')],
        ),
        adjustContext(
          [createRegistryUbo('John Doe'), createRegistryUbo('Jane Smith')],
          [createCollectionUbo('Jane', 'Smith'), createCollectionUbo('John', 'Doe')],
        ),
      ];

      for (const modifiedContext of modifiedContexts) {
        const result = await engine.run(modifiedContext, helpers);
        expectResult(result, 'FAILED');
      }
    });

    it('should fail when UBOs are cased differently', async () => {
      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(
        adjustContext([createRegistryUbo('John Doe')], [createCollectionUbo('john', 'doe')]),
        helpers,
      );
      expectResult(result, 'FAILED');
    });

    it('should fail when UBOs are empty', async () => {
      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(adjustContext([], []), helpers);
      expectResult(result, 'FAILED');
    });

    it('should pass (hit) when UBOs names do not match exactly', async () => {
      const modifiedContext = adjustContext(
        [createRegistryUbo('John Dorian Doe')],
        [createCollectionUbo('John', 'Doe')],
      );

      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(modifiedContext, helpers);
      expectResult(result, 'PASSED');
    });

    it('should pass (hit) when UBOs count differs', async () => {
      const modifiedContext = adjustContext(
        [createRegistryUbo('John Doe'), createRegistryUbo('Jane Smith')],
        [
          createCollectionUbo('John', 'Doe'),
          createCollectionUbo('Jane', 'Smith'),
          createCollectionUbo('Additional', 'Person'),
        ],
      );

      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(modifiedContext, helpers);
      expectResult(result, 'PASSED');
    });
  });
});

import {
  DataValueNotFoundError,
  OPERATION,
  RuleResult,
  RuleResultSet,
  RuleSet,
  ValidationFailedError,
} from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';

describe('COMPANY_SANCTIONS_CATEGORIES operator', () => {
  it('should pass when sanctions categories meet the default threshold (1)', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Sanctions'],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: OPERATION.COMPANY_SANCTIONS_CATEGORIES,
          value: {
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should pass when sanctions categories exceed the specified threshold', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Sanctions'],
                  },
                  {
                    categories: ['Sanctions'],
                  },
                  {
                    categories: ['Other Category'],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: 'COMPANY_SANCTIONS_CATEGORIES',
          value: {
            threshold: 2,
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail when sanctions categories do not meet the threshold', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Other Category'],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: OPERATION.COMPANY_SANCTIONS_CATEGORIES,
          value: {
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
  });

  it('should handle case insensitivity for category name', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['SANCTIONS'],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: 'COMPANY_SANCTIONS_CATEGORIES',
          value: {
            category: 'sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should handle multiple sources with categories', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Other Category'],
                  },
                ],
              },
            },
            {
              entity: {
                sources: [
                  {
                    categories: ['Sanctions'],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: 'COMPANY_SANCTIONS_CATEGORIES',
          value: {
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail when companySanctions data does not exist', async () => {
    const mockData = {
      pluginsOutput: {
        otherData: {},
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: 'COMPANY_SANCTIONS_CATEGORIES',
          value: {
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(ValidationFailedError);
  });

  it('should fail when companySanctions data is an empty array', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [],
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: 'and',
      rules: [
        {
          operator: 'COMPANY_SANCTIONS_CATEGORIES',
          value: {
            category: 'Sanctions',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect(validationResults[0]!.error).toBeUndefined();
  });
});

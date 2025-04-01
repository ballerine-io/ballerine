import { DataValueNotFoundError, RuleResult, RuleResultSet, RuleSet } from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';

describe('COMPANY_SANCTIONS_ADVERSE_MEDIA operator', () => {
  it('should pass when adverse media sources meet the default threshold (1)', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Adverse Media'],
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {} as any,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should pass when adverse media sources exceed the specified threshold', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['Adverse Media'],
                  },
                  {
                    categories: ['Adverse Media'],
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {
            threshold: 2,
          } as any,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail when adverse media sources do not meet the threshold', async () => {
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {} as any,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
  });

  it('should handle case insensitivity for adverse media category name', async () => {
    const mockData = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                sources: [
                  {
                    categories: ['ADVERSE MEDIA'],
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {} as any,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should handle multiple sources with adverse media categories', async () => {
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
                    categories: ['Adverse Media'],
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {} as any,
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
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA' as any,
          value: {} as any,
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(DataValueNotFoundError);
  });
});

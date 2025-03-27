import { OPERATOR, OPERATION, RuleResult, RuleResultSet, RuleSet } from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';

describe('Company Sanctions Contains Adverse Media Rule', () => {
  it('should detect when company sanctions has adverse media using IN operator', async () => {
    // Mock data with company sanctions that include adverse media in source categories
    const mockDataWithAdverseMedia = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                name: 'Test Company',
                sources: [
                  {
                    url: 'https://example.com/source1',
                    dates: ['2023-01-01'],
                    categories: ['Adverse Media', 'Corporate/Business'],
                  },
                ],
                categories: ['Special Interest Entity (SIE)'],
              },
              matchedFields: ['FullPrimaryName'],
            },
          ],
          status: 'SUCCESS',
        },
      },
    };

    // Mock data with company sanctions but no adverse media
    const mockDataWithoutAdverseMedia = {
      pluginsOutput: {
        companySanctions: {
          data: [
            {
              entity: {
                name: 'Test Company',
                sources: [
                  {
                    url: 'https://example.com/source1',
                    dates: ['2023-01-01'],
                    categories: ['Corporate/Business', 'Regulatory Enforcement List'],
                  },
                ],
                categories: ['Special Interest Entity (SIE)'],
              },
              matchedFields: ['FullPrimaryName'],
            },
          ],
          status: 'SUCCESS',
        },
      },
    };

    // Create the rule set that should detect adverse media in company sanctions
    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.companySanctions.data[0].entity.sources[0].categories',
          operator: OPERATION.IN_CASE_INSENSITIVE,
          value: ['Adverse Media'],
          isPathComparison: false,
        },
      ],
    };

    // Test with data that has adverse media
    const engineWithAdverseMedia = createRuleEngine(ruleSet);
    const resultsWithAdverseMedia = await engineWithAdverseMedia.run(mockDataWithAdverseMedia);

    expect(resultsWithAdverseMedia).toBeDefined();
    expect(resultsWithAdverseMedia).toHaveLength(1);
    expect(resultsWithAdverseMedia[0]?.status).toBe('PASSED');

    // Test with data that doesn't have adverse media
    const engineWithoutAdverseMedia = createRuleEngine(ruleSet);
    const resultsWithoutAdverseMedia = await engineWithoutAdverseMedia.run(
      mockDataWithoutAdverseMedia,
    );

    expect(resultsWithoutAdverseMedia).toBeDefined();
    expect(resultsWithoutAdverseMedia).toHaveLength(1);
    expect(resultsWithoutAdverseMedia[0]?.status).toBe('FAILED');
  });

  it('should handle empty or missing company sanctions data', async () => {
    // Mock data with empty company sanctions data
    const mockDataWithEmptySanctions = {
      pluginsOutput: {
        companySanctions: {
          data: [],
          status: 'SUCCESS',
        },
      },
    };

    // Mock data with no company sanctions plugin
    const mockDataWithoutSanctions = {
      pluginsOutput: {},
    };

    // Create the rule set
    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.companySanctions.data[0].entity.sources[0].categories',
          operator: OPERATION.IN_CASE_INSENSITIVE,
          value: ['Adverse Media'],
          isPathComparison: false,
        },
      ],
    };

    // Test with empty sanctions data
    const engineWithEmptySanctions = createRuleEngine(ruleSet);
    const resultsWithEmptySanctions = await engineWithEmptySanctions.run(
      mockDataWithEmptySanctions,
    );

    expect(resultsWithEmptySanctions).toBeDefined();
    expect(resultsWithEmptySanctions).toHaveLength(1);
    expect(resultsWithEmptySanctions[0]?.status).toBe('FAILED');

    // Test with no sanctions data
    const engineWithoutSanctions = createRuleEngine(ruleSet);
    const resultsWithoutSanctions = await engineWithoutSanctions.run(mockDataWithoutSanctions);

    expect(resultsWithoutSanctions).toBeDefined();
    expect(resultsWithoutSanctions).toHaveLength(1);
    expect(resultsWithoutSanctions[0]?.status).toBe('FAILED');
  });
});

import { OPERATOR, RuleResult, RuleResultSet, RuleSet } from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';
import { z } from 'zod';

describe('Company Sanctions Adverse Media Rule', () => {
  it('should detect when company sanctions has adverse media', async () => {
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

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.companySanctions.data',
          operator: 'EXISTS',
          value: {
            schema: z.any(),
          },
        },
        {
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA',
          value: true,
        },
      ],
    };

    const engineWithAdverseMedia = createRuleEngine(ruleSet);
    const resultsWithAdverseMedia = await engineWithAdverseMedia.run(mockDataWithAdverseMedia);

    expect(resultsWithAdverseMedia).toBeDefined();
    expect(resultsWithAdverseMedia).toHaveLength(2);
    expect(resultsWithAdverseMedia[0]?.status).toBe('PASSED');
    expect(resultsWithAdverseMedia[1]?.status).toBe('PASSED');

    const engineWithoutAdverseMedia = createRuleEngine(ruleSet);
    const resultsWithoutAdverseMedia = await engineWithoutAdverseMedia.run(
      mockDataWithoutAdverseMedia,
    );

    expect(resultsWithoutAdverseMedia).toBeDefined();
    expect(resultsWithoutAdverseMedia).toHaveLength(2);
    expect(resultsWithoutAdverseMedia[0]?.status).toBe('PASSED');
    expect(resultsWithoutAdverseMedia[1]?.status).toBe('FAILED');
  });

  it('should handle empty or missing company sanctions data', async () => {
    const mockDataWithEmptySanctions = {
      pluginsOutput: {
        companySanctions: {
          data: [],
          status: 'SUCCESS',
        },
      },
    };

    const mockDataWithoutSanctions = {
      pluginsOutput: {},
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.companySanctions.data',
          operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA',
          value: true,
        },
      ],
    };

    const engineWithEmptySanctions = createRuleEngine(ruleSet);
    const resultsWithEmptySanctions = await engineWithEmptySanctions.run(
      mockDataWithEmptySanctions,
    );

    expect(resultsWithEmptySanctions).toBeDefined();
    expect(resultsWithEmptySanctions).toHaveLength(1);
    expect(resultsWithEmptySanctions[0]?.status).toBe('FAILED');

    const engineWithoutSanctions = createRuleEngine(ruleSet);
    const resultsWithoutSanctions = await engineWithoutSanctions.run(mockDataWithoutSanctions);

    expect(resultsWithoutSanctions).toBeDefined();
    expect(resultsWithoutSanctions).toHaveLength(1);
    expect(resultsWithoutSanctions[0]?.status).toBe('FAILED');
  });
});

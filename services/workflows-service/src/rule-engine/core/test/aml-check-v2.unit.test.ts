import { OPERATION, OPERATOR, RuleSet } from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';
import {
  amlV2ContextNoHits,
  amlV2ContextWithDirectors,
  amlV2ContextWithMainRepresentative,
  amlV2ContextWithUbos,
  helpers,
} from './data-helper';

describe('AML v2 operator', () => {
  const testCases = [
    // No hits - all should fail
    {
      key: 'adverseMedia.length' as const,
      name: 'adverse media',
      context: amlV2ContextNoHits,
      expectedStatus: 'FAILED' as const,
    },
    {
      key: 'pep.length' as const,
      name: 'pep',
      context: amlV2ContextNoHits,
      expectedStatus: 'FAILED' as const,
    },
    {
      key: 'sanctions.length' as const,
      name: 'sanctions',
      context: amlV2ContextNoHits,
      expectedStatus: 'FAILED' as const,
    },
    {
      key: 'fitnessProbity.length' as const,
      name: 'fitness probity',
      context: amlV2ContextNoHits,
      expectedStatus: 'FAILED' as const,
    },
    {
      key: 'warnings.length' as const,
      name: 'warnings',
      context: amlV2ContextNoHits,
      expectedStatus: 'FAILED' as const,
    },

    // Hits - all should pass
    {
      key: 'adverseMedia.length' as const,
      name: 'adverse media',
      context: amlV2ContextWithUbos,
      expectedStatus: 'PASSED' as const,
    },
    {
      key: 'pep.length' as const,
      name: 'pep',
      context: amlV2ContextWithDirectors,
      expectedStatus: 'PASSED' as const,
    },
    {
      key: 'sanctions.length' as const,
      name: 'sanctions',
      context: amlV2ContextWithMainRepresentative,
      expectedStatus: 'PASSED' as const,
    },
    {
      key: 'fitnessProbity.length' as const,
      name: 'fitness probity',
      context: amlV2ContextWithUbos,
      expectedStatus: 'PASSED' as const,
    },
    {
      key: 'warnings.length' as const,
      name: 'warnings',
      context: amlV2ContextWithUbos,
      expectedStatus: 'PASSED' as const,
    },
  ];

  testCases.forEach(({ key, name, context, expectedStatus }) => {
    it(`should ${expectedStatus === 'PASSED' ? 'resolve' : 'fail'} ${name}`, async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key,
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
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
            "key": "${key}",
            "operator": "AML_CHECK_V2",
            "value": {
              "operator": "GTE",
              "value": 1,
            },
          },
          "status": "${expectedStatus}",
        }
      `);
    });
  });
});

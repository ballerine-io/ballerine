import { OPERATION, OPERATOR, RuleSet } from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';
import {
  amlV2ContextNoHits,
  amlV2ContextWithDirectors,
  amlV2ContextWithMainRepresentative,
  amlV2ContextWithUbos,
} from './data-helper';

const helpers = {
  getEndUserById: async (id: string) => {
    if (id === 'NO_HITS') {
      return {
        amlHits: [],
      };
    } else {
      return {
        amlHits: [
          {
            pep: [
              {
                date: null,
                type: null,
                sourceUrl: 'https://www.cia.gov/resources/world-leaders/foreign-governments/',
                sourceName: 'Central Intelligence Agency Foreign Governments Leadership',
              },
            ],
            other: [],
            vendor: 'veriff',
            warnings: [],
            countries: ['Austria', 'Brazil', 'Germany', 'Switzerland', 'United Kingdom'],
            sanctions: [
              {
                sourceUrl:
                  'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                sourceName: 'OFAC SDN List',
                date: '2023-05-08T00:00:00Z',
              },
            ],
            matchTypes: ['name_exact'],
            matchedName: 'Charles Philip Arthur George',
            adverseMedia: [
              {
                date: '2023-09-06T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.connexionfrance.com/news/while-the-world-mocks-the-british-royal-family-france-remains-loyal/218884',
                sourceName:
                  "'While the world mocks the British Royal Family, France remains loyal'",
              },
            ],
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
    }
  },
};

describe('AML v2 operator', () => {
  describe('no hits - rules not matched', () => {
    it('should fail adverse media', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'adverseMedia.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextNoHits, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "adverseMedia.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "FAILED",
          }
        `);
    });

    it('should fail pep', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pep.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextNoHits, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "pep.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "FAILED",
          }
        `);
    });

    it('should fail sanctions', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'sanctions.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextNoHits, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "sanctions.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "FAILED",
          }
        `);
    });

    it('should fail fitnessProbity', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'fitnessProbity.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextNoHits, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "fitnessProbity.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "FAILED",
          }
        `);
    });
  });

  describe('hits - rules matched', () => {
    it('should resolve adverse media', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'adverseMedia.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextWithUbos, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "adverseMedia.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "PASSED",
          }
        `);
    });

    it('should resolve pep', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pep.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextWithDirectors, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "pep.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "PASSED",
          }
        `);
    });

    it('should resolve sanctions', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'sanctions.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextWithMainRepresentative, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "sanctions.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "PASSED",
          }
        `);
    });

    it('should resolve fitness probity', async () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'fitnessProbity.length',
            operator: OPERATION.AML_CHECK_V2,
            value: {
              operator: OPERATION.GTE,
              value: 1,
            },
          },
        ],
      };

      const engine = createRuleEngine(ruleSetExample);
      const result = await engine.run(amlV2ContextWithUbos, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
          {
            "error": undefined,
            "rule": {
              "key": "fitnessProbity.length",
              "operator": "AML_CHECK_V2",
              "value": {
                "operator": "GTE",
                "value": 1,
              },
            },
            "status": "PASSED",
          }
        `);
    });
  });
});

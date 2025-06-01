import { OPERATION, OPERATOR, RuleSet } from '@ballerine/common';

import { helpers } from './data-helper';
import { createRuleEngine } from '../rule-engine';

const ruleSet: RuleSet = {
  operator: OPERATOR.AND,
  rules: [
    {
      value: undefined,
      key: 'bankAccountVerification',
      operator: OPERATION.BANK_ACCOUNT_VERIFICATION,
    },
  ],
};

const successResult = {
  error: undefined,
  rule: {
    key: 'bankAccountVerification',
    operator: 'BANK_ACCOUNT_VERIFICATION',
    value: undefined,
  },
  status: 'PASSED',
};

const failedResult = {
  error: undefined,
  rule: {
    key: 'bankAccountVerification',
    operator: 'BANK_ACCOUNT_VERIFICATION',
    value: undefined,
  },
  status: 'FAILED',
};

describe('Bank account verification operator', () => {
  describe('should fail', () => {
    it('when one of the rules have ruleScore 1', async () => {
      const bankAccountVerificationContextWithFailedRules = {
        pluginsOutput: {
          bankAccountVerification: {
            data: {
              responseHeader: {
                requestType: 'BAVCommercial-Standard',
              },
              clientResponsePayload: {
                decisionElements: [
                  {
                    rules: [
                      { ruleId: 'CMM1069', ruleScore: 1 },
                      { ruleId: 'CMM1048', ruleScore: 0 },
                      { ruleId: 'CMM1052', ruleScore: 0 },
                    ],
                  },
                ],
              },
            },
          },
        },
      };

      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(bankAccountVerificationContextWithFailedRules, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(failedResult);
    });

    it('when multiple rules have ruleScore 1', async () => {
      const contextWithMultipleFailedRules = {
        pluginsOutput: {
          bankAccountVerification: {
            data: {
              responseHeader: {
                requestType: 'BAVCommercial-Standard',
              },
              clientResponsePayload: {
                decisionElements: [
                  {
                    rules: [
                      { ruleId: 'CMM1069', ruleScore: 1 },
                      { ruleId: 'CMM1048', ruleScore: 1 },
                      { ruleId: 'CMM1052', ruleScore: 0 },
                    ],
                  },
                ],
              },
            },
          },
        },
      };

      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(contextWithMultipleFailedRules, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(failedResult);
    });

    it('when all rules have ruleScore 1', async () => {
      const contextWithAllFailedRules = {
        pluginsOutput: {
          bankAccountVerification: {
            data: {
              responseHeader: {
                requestType: 'BAVCommercial-Standard',
              },
              clientResponsePayload: {
                decisionElements: [
                  {
                    rules: [
                      { ruleId: 'CMM1069', ruleScore: 1 },
                      { ruleId: 'CMM1048', ruleScore: 1 },
                      { ruleId: 'CMM1052', ruleScore: 1 },
                    ],
                  },
                ],
              },
            },
          },
        },
      };

      const engine = createRuleEngine(ruleSet);
      const result = await engine.run(contextWithAllFailedRules, helpers);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(failedResult);
    });

    describe('should pass', () => {
      it('when all rules have ruleScore 0', async () => {
        const bankAccountVerificationContextThatPasses = {
          pluginsOutput: {
            bankAccountVerification: {
              data: {
                responseHeader: {
                  requestType: 'BAVCommercial-Standard',
                },
                clientResponsePayload: {
                  decisionElements: [
                    {
                      rules: [
                        { ruleId: 'CMM1069', ruleScore: 0 },
                        { ruleId: 'CMM1048', ruleScore: 0 },
                        { ruleId: 'CMM1052', ruleScore: 0 },
                      ],
                    },
                  ],
                },
              },
            },
          },
        };

        const engine = createRuleEngine(ruleSet);
        const result = await engine.run(bankAccountVerificationContextThatPasses, helpers);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          error: undefined,
          rule: {
            key: 'bankAccountVerification',
            operator: 'BANK_ACCOUNT_VERIFICATION',
            value: undefined,
          },
          status: 'PASSED',
        });
      });

      it('when only non-required rules have ruleScore 1', async () => {
        const contextWithFailingNonRequiredRules = {
          pluginsOutput: {
            bankAccountVerification: {
              data: {
                responseHeader: {
                  requestType: 'BAVCommercial-Standard',
                },
                clientResponsePayload: {
                  decisionElements: [
                    {
                      rules: [
                        { ruleId: 'CMM1069', ruleScore: 0 },
                        { ruleId: 'CMM1048', ruleScore: 0 },
                        { ruleId: 'CMM1052', ruleScore: 0 },
                        { ruleId: 'CMM9999', ruleScore: 1 },
                        { ruleId: 'OTHER_RULE', ruleScore: 1 },
                      ],
                    },
                  ],
                },
              },
            },
          },
        };

        const engine = createRuleEngine(ruleSet);
        const result = await engine.run(contextWithFailingNonRequiredRules, helpers);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          error: undefined,
          rule: {
            key: 'bankAccountVerification',
            operator: 'BANK_ACCOUNT_VERIFICATION',
            value: undefined,
          },
          status: 'PASSED',
        });
      });

      it('when requestType is not BAVCommercial-Standard', async () => {
        const contextWithInvalidRequestType = {
          pluginsOutput: {
            bankAccountVerification: {
              data: {
                responseHeader: {
                  requestType: 'BAVConsumer-Standard',
                },
                clientResponsePayload: {
                  decisionElements: [
                    {
                      rules: [
                        { ruleId: 'CMM1069', ruleScore: 0 },
                        { ruleId: 'CMM1048', ruleScore: 0 },
                        { ruleId: 'CMM1052', ruleScore: 0 },
                      ],
                    },
                  ],
                },
              },
            },
          },
        };

        const engine = createRuleEngine(ruleSet);
        const result = await engine.run(contextWithInvalidRequestType, helpers);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject(successResult);
      });
    });
  });
});

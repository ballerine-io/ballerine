import {
  DataValueNotFoundError,
  OPERATOR,
  RuleResult,
  RuleResultSet,
  RuleSet,
} from '@ballerine/common';
import { createRuleEngine } from '../rule-engine';

describe('IDV_CHECK operator', () => {
  it('should pass when decision status is declined', async () => {
    const mockData = {
      childWorkflows: {
        kyc_email_session_example: {
          example_id_001: {
            result: {
              vendorResult: {
                decision: {
                  status: 'declined',
                  decisionScore: 0.05,
                },
              },
            },
          },
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'decision.status',
          operator: 'IDV_CHECK',
          value: {
            childWorkflowName: 'kyc_email_session_example',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail when decision status is not declined', async () => {
    const mockData = {
      childWorkflows: {
        kyc_email_session_example: {
          example_id_001: {
            result: {
              vendorResult: {
                decision: {
                  status: 'approved',
                  decisionScore: 0.95,
                },
              },
            },
          },
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'decision.status',
          operator: 'IDV_CHECK',
          value: {
            childWorkflowName: 'kyc_email_session_example',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('FAILED');
  });

  it('should handle case insensitivity for decision status', async () => {
    const mockData = {
      childWorkflows: {
        kyc_email_session_example: {
          example_id_001: {
            result: {
              vendorResult: {
                decision: {
                  status: 'DECLINED',
                  decisionScore: 0.05,
                },
              },
            },
          },
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'decision.status',
          operator: 'IDV_CHECK',
          value: {
            childWorkflowName: 'kyc_email_session_example',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should handle multiple child workflows with different decision statuses', async () => {
    const mockData = {
      childWorkflows: {
        kyc_email_session_example: {
          example_id_001: {
            result: {
              vendorResult: {
                decision: {
                  status: 'approved',
                  decisionScore: 0.95,
                },
              },
            },
          },
          example_id_002: {
            result: {
              vendorResult: {
                decision: {
                  status: 'declined',
                  decisionScore: 0.05,
                },
              },
            },
          },
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'decision.status',
          operator: 'IDV_CHECK',
          value: {
            childWorkflowName: 'kyc_email_session_example',
          },
        },
      ],
    };

    const validationResults: RuleResultSet = await createRuleEngine(ruleSet).run(mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(1);
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail when child workflow does not exist', async () => {
    const mockData = {
      childWorkflows: {
        some_other_workflow: {
          example_id_001: {
            result: {
              vendorResult: {
                decision: {
                  status: 'declined',
                  decisionScore: 0.05,
                },
              },
            },
          },
        },
      },
    };

    const ruleSet: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'decision.status',
          operator: 'IDV_CHECK',
          value: {
            childWorkflowName: 'kyc_email_session_example',
          },
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

import { search } from 'jmespath';
import * as jsonLogic from 'json-logic-js';

type TJmespathRule = {
  type: 'jmespath';
  options: {
    rule: string;
  };
};

export type TJsonLogicRule = {
  type: 'json-logic';
  options: {
    rule: Record<string, unknown>;
  };
};

const DEFAULT_VALIDATION_CONTEXT = {
  projectId: 'test',
  workflowRuntimeId: 'test',
  childWorkflows: { kyc_email_session_example: { test: 'test' } },
  documents: [],
};

export type TDefintionRules = TJmespathRule | TJsonLogicRule;

export const ruleValidator = ({
  type,
  options: { rule },
}: TJmespathRule | TJsonLogicRule): void => {
  if (type === 'jmespath') {
    try {
      search(DEFAULT_VALIDATION_CONTEXT, rule as string);
    } catch (ex) {
      throw new Error(`Invalid jmespath rule: ${rule as string}`);
    }
  }

  if (type === 'json-logic') {
    try {
      jsonLogic.apply(rule, DEFAULT_VALIDATION_CONTEXT);
    } catch (ex) {
      throw new Error(`JSON logic rule is invalid ${JSON.stringify(rule)}`);
    }
  }
};

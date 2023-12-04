import { search } from 'jmespath';
import * as jsonLogic from 'json-logic-js';
import { AnyRecord } from '@ballerine/common';

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

export const DEFAULT_VALIDATION_CONTEXT = {
  projectId: 'test',
  workflowRuntimeId: 'test',
  childWorkflows: { kyc_email_session_example: { test: 'test' } },
  pluginsOutput: {
    businessInformation: {},
    ubo: {},
    companySanctions: {},
  },
  documents: [],
};

export type TDefintionRules = TJmespathRule | TJsonLogicRule;

export const ruleValidator = (
  { type, options: { rule } }: TJmespathRule | TJsonLogicRule,
  exampleContext?: AnyRecord,
): void => {
  if (type === 'jmespath') {
    try {
      search({ ...DEFAULT_VALIDATION_CONTEXT, ...exampleContext }, rule as string);
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

import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import { z } from 'zod';

import { Rule } from '@/rule-engine';
import { IdvCheckParams } from './types';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';

function createIdvCheckOperator() {
  const operator = 'IDV_CHECK';

  const extractValue = (data: unknown, rule: Rule) => {
    const idvRule = rule as Extract<Rule, { operator: 'IDV_CHECK' }>;

    const result = z.record(z.string(), z.any()).safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('extract', 'parsing failed', result.error);
    }

    const objData = result.data;

    const childWorkflows = objData.childWorkflows[idvRule.value.childWorkflowName];

    if (!childWorkflows) {
      throw new DataValueNotFoundError(`childWorkflows.${idvRule.value.childWorkflowName}`);
    }

    const childWorkflowKeys = Object.keys(childWorkflows || {});

    if (isEmpty(childWorkflowKeys)) {
      throw new DataValueNotFoundError(`childWorkflows.${idvRule.value.childWorkflowName}`);
    }

    const decisions = childWorkflowKeys
      .map(workflowId => get(childWorkflows, `${workflowId}.result.vendorResult.decision.status`))
      .filter(Boolean);

    if (isEmpty(decisions)) {
      throw new DataValueNotFoundError(rule.key);
    }

    return decisions;
  };

  const evaluate = async (dataValue: unknown, conditionValue: IdvCheckParams): Promise<boolean> => {
    if (!dataValue || (Array.isArray(dataValue) && dataValue.length === 0)) {
      return false;
    }

    const expectedStatus = 'declined';

    if (Array.isArray(dataValue)) {
      return dataValue.some(
        status => typeof status === 'string' && status.toLowerCase() === expectedStatus,
      );
    }

    return typeof dataValue === 'string' && dataValue.toLowerCase() === expectedStatus;
  };

  const execute = async (
    value: unknown,
    comparisonValue: IdvCheckParams,
    options: { unifiedApiClient: any; threshold: number },
  ) => {
    return evaluate(value, comparisonValue);
  };

  return {
    operator,
    extractValue,
    evaluate,
    execute,
  };
}

export const IDV_CHECK = createIdvCheckOperator();

import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import { z } from 'zod';

import { Rule } from '@/rule-engine';
import { IdvCheckParams } from './types';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';
import { BaseOperator } from './helpers';
import { IdvCheckSchema } from './schemas';

class IdvCheck extends BaseOperator<string[], IdvCheckParams> {
  constructor() {
    super({
      operator: 'IDV_CHECK',
      conditionValueSchema: IdvCheckSchema,
    });
  }

  extractValue(data: unknown, rule: Rule) {
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

    return decisions as string[];
  }

  evaluate(dataValue: string[], conditionValue: IdvCheckParams): boolean {
    if (!dataValue || dataValue.length === 0) {
      return false;
    }

    const expectedStatus = 'declined';

    return dataValue.some(
      status => typeof status === 'string' && status.toLowerCase() === expectedStatus,
    );
  }
}

export const IDV_CHECK = new IdvCheck();

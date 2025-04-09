import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import { z } from 'zod';

import { Rule } from '@/rule-engine';
import { IdvCheckParams } from './types';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';
import { BaseOperator } from './helpers';
import { IdvCheckSchema } from './schemas';

const IDV_DECLINED_STATUS = 'declined';

const createDataSchema = (childWorkflowName: string) =>
  z.object({
    childWorkflows: z
      .record(z.string(), z.record(z.string(), z.any()))
      .refine(childWorkflows => !!childWorkflows[childWorkflowName], {
        message: `childWorkflows.${childWorkflowName} not found`,
        path: [`childWorkflows.${childWorkflowName}`],
      })
      .refine(childWorkflows => Object.keys(childWorkflows[childWorkflowName] || {}).length > 0, {
        message: `childWorkflows.${childWorkflowName} is empty`,
        path: [`childWorkflows.${childWorkflowName}`],
      }),
  });

class IdvCheck extends BaseOperator<string[], IdvCheckParams> {
  constructor() {
    super({
      operator: 'IDV_CHECK',
      conditionValueSchema: IdvCheckSchema,
    });
  }

  extractValue(data: unknown, rule: Rule) {
    const idvRule = rule as Extract<Rule, { operator: 'IDV_CHECK' }>;
    const childWorkflowName = idvRule.value.childWorkflowName;

    const dataSchema = createDataSchema(childWorkflowName);

    const result = dataSchema.safeParse(data);

    if (!result.success) {
      const error = result.error;
      const errorPath = error.errors[0]?.path.join('.');

      if (errorPath?.includes(childWorkflowName)) {
        throw new DataValueNotFoundError(`childWorkflows.${childWorkflowName}`);
      }

      throw new ValidationFailedError('extract', 'parsing failed', error);
    }

    const childWorkflows = result.data.childWorkflows[childWorkflowName];
    const childWorkflowKeys = Object.keys(childWorkflows || {});

    const decisions = childWorkflowKeys
      .map(workflowId => get(childWorkflows, `${workflowId}.result.vendorResult.decision.status`))
      .filter((status): status is string => typeof status === 'string' && status !== '');

    if (isEmpty(decisions)) {
      throw new Error('No decisions found');
    }

    return decisions;
  }

  evaluate(dataValue: string[], conditionValue: IdvCheckParams): boolean {
    const expectedStatus = IDV_DECLINED_STATUS;

    return dataValue.some(status => status.toLowerCase() === expectedStatus);
  }
}

export const IDV_CHECK = new IdvCheck();

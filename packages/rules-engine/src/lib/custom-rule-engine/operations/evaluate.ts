import { logger } from 'nx/src/utils/logger';
import { CustomRule } from '@/lib/custom-rule-engine/types/custom-rule';
import { castValue } from '@/lib/custom-rule-engine/helpers/cast-value';
import { castCompareWithEval } from '../helpers/cast-compare-value';

export const evaluate: CustomRule = ({ rule, context, fieldPath }) => {
  const { options } = rule;
  const { operations, compareValue: comparableValue } = options;
  if (!fieldPath) {
    logger.warn('Field path is not provided for rule evaluation');

    throw new Error('Field path is not provided for rule evaluation');
  }
  if (comparableValue === null || comparableValue === undefined) {
    logger.warn('Comparable value is not provided for rule evaluation');

    throw new Error('Comparable value is not provided for rule evaluation');
  }

  const fieldValue = context[fieldPath];
  const compareValue = castValue(options, String(fieldValue));
  const targetValue = castCompareWithEval(options, comparableValue);

  switch (operations) {
    case 'equal':
      return compareValue === targetValue;
    case 'not_equal':
      return compareValue !== targetValue;
    case 'contains':
      if (!(typeof compareValue === 'string' || Array.isArray(compareValue))) {
        logger.warn(`Invalid formattedCompareValue: ${compareValue}`);

        return false;
      }

      if (Array.isArray(compareValue)) {
        return compareValue.includes(targetValue);
      }

      return compareValue.includes(String(targetValue));
    case 'not_contains':
      if (!(typeof compareValue === 'string' || Array.isArray(compareValue))) {
        logger.warn(`Invalid formattedCompareValue: ${compareValue}`);

        return false;
      }

      if (Array.isArray(compareValue)) {
        return !compareValue.includes(targetValue);
      }

      return !compareValue.includes(String(targetValue));
    case 'greater_than':
      return targetValue > compareValue;
    case 'less_than':
      return compareValue < targetValue;
    case undefined:
      return true;
    default:
      operations satisfies never;

      throw new Error(`Invalid operation: ${operations}`);
  }
};

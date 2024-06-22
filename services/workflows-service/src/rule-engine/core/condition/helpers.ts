import { primitive, ConditionFn, BetweenParams, LastYearsParams } from './types';

const _isPrimitive = (value: any) => {
  return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
};

const validateOperator = (
  operator: string,
  args: { dataValue: unknown; conditionValue: unknown },
) => {
  if (!_isPrimitive(args.dataValue)) {
    throw new Error(`${operator}: Unsupported data type ${typeof args.dataValue}`);
  }

  if (!_isPrimitive(args.conditionValue)) {
    throw new Error(`${operator}: Unsupported condition value type ${typeof args.conditionValue}`);
  }
};

export const EQUALS: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  validateOperator('EQUALS', { dataValue, conditionValue });

  return dataValue === conditionValue;
};

export const GT: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  validateOperator('GT', { dataValue, conditionValue });

  return dataValue > conditionValue;
};

export const LT: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  validateOperator('LT', { dataValue, conditionValue });

  return dataValue < conditionValue;
};

export const GTE: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  validateOperator('GTE', { dataValue, conditionValue });

  return EQUALS(dataValue, conditionValue) || GT(dataValue, conditionValue);
};

export const LTE: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  validateOperator('LTE', { dataValue, conditionValue });

  return EQUALS(dataValue, conditionValue) || LT(dataValue, conditionValue);
};

export const BETWEEN: ConditionFn<BetweenParams> = (
  dataValue: primitive,
  conditionValue: BetweenParams,
): boolean => {
  return GTE(dataValue, conditionValue.min) && LTE(dataValue, conditionValue.max);
};

export const LAST_YEAR: ConditionFn<LastYearsParams> = (
  dataValue: unknown,
  conditionValue: LastYearsParams,
): boolean => {
  if (typeof dataValue === 'string' || dataValue instanceof Date) {
    const date = new Date(dataValue);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - conditionValue.years);
    return date >= oneYearAgo;
  }

  throw new Error(`LAST_YEAR: Unsupported data type ${typeof dataValue}`);
};

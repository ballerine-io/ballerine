import { primitive, ConditionFn, IBetweenParams } from './types';

export const EQUALS: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  return dataValue === conditionValue;
};
export const GT: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  return dataValue > conditionValue;
};
export const LT: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  return dataValue < conditionValue;
};
export const GTE: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  return EQUALS(dataValue, conditionValue) || GT(dataValue, conditionValue);
};
export const LTE: ConditionFn = (dataValue: primitive, conditionValue: primitive): boolean => {
  return EQUALS(dataValue, conditionValue) || LT(dataValue, conditionValue);
};
export const BETWEEN: ConditionFn<IBetweenParams> = (
  dataValue: primitive,
  conditionValue: IBetweenParams,
): boolean => {
  return GTE(dataValue, conditionValue.min) && LTE(dataValue, conditionValue.max);
};

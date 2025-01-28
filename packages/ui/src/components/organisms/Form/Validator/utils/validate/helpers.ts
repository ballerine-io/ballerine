import jsonLogic from 'json-logic-js';
import { IValidationRule } from '../../types';

export const isShouldApplyValidation = (rule: IValidationRule, context: object) => {
  return Boolean(jsonLogic.apply(rule.value, context));
};

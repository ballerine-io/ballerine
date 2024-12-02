import { ICommonValidator } from '../../types';
import { baseValidatorsMap, validatorsExtends } from '../../validators';

export const getValidator = (validator: ICommonValidator) => {
  const validatorFn = baseValidatorsMap[validator.type] || validatorsExtends[validator.type];

  if (!validatorFn) {
    throw new Error(`Validator ${validator.type} not found.`);
  }

  return validatorFn;
};

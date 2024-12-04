import { ICommonValidator, TBaseValidators } from '../../types';
import { baseValidatorsMap, validatorsExtends } from '../../validators';

export const getValidator = <TValidatorTypeExtends extends string = TBaseValidators>(
  validator: ICommonValidator<object, TValidatorTypeExtends>,
) => {
  const validatorFn =
    baseValidatorsMap[validator.type as unknown as TBaseValidators] ||
    validatorsExtends[validator.type];

  if (!validatorFn) {
    throw new Error(`Validator ${validator.type} not found.`);
  }

  return validatorFn;
};

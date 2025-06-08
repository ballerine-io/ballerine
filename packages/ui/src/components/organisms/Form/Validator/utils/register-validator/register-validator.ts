import { TValidator } from '../../types';
import { validatorsExtends } from '../../validators';

export const registerValidator = <T extends string>(
  type: T,
  validator: TValidator<any, any, T, any>,
) => {
  validatorsExtends[type] = validator as TValidator<any, any>;

  return validator;
};

import { TValidator } from '../../types';
import { validatorsExtends } from '../../validators';

export const registerValidator = (type: string, validator: TValidator<any, any>) => {
  validatorsExtends[type] = validator;

  return validator;
};

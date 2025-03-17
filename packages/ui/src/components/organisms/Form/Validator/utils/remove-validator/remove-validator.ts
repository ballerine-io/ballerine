import { validatorsExtends } from '../../validators';

export const removeValidator = (type: string) => {
  delete validatorsExtends[type];
};

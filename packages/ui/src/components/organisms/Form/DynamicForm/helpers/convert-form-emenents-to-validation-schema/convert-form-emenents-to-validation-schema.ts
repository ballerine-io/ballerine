import { IValidationSchema } from '../../../Validator';
import { IFormElement } from '../../types';

export const convertFormElementsToValidationSchema = (
  elements: Array<IFormElement<any>>,
): IValidationSchema[] => {
  return elements.map(element => {
    const validationSchema: IValidationSchema = {
      id: element.id,
      valueDestination: element.valueDestination,
      validators: element.validate || [],
    };

    if (element.children) {
      validationSchema.children = convertFormElementsToValidationSchema(element.children);
    }

    return validationSchema;
  });
};

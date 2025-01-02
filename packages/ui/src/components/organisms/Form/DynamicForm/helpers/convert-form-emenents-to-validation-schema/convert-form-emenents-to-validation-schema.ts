import { IValidationSchema } from '../../../Validator';
import { IFormElement } from '../../types';

export const convertFormElementsToValidationSchema = (
  elements: Array<IFormElement<any>>,
  schema: IValidationSchema[] = [],
): IValidationSchema[] => {
  const filteredElements = elements.filter(
    element => element.valueDestination || element.children?.length,
  );

  for (let i = 0; i < filteredElements.length; i++) {
    const element = filteredElements[i]!;

    if (element.valueDestination) {
      schema.push({
        id: element.id,
        valueDestination: element.valueDestination,
        validators: element.validate || [],
      });

      if (element.children?.length) {
        schema[i]!.children = convertFormElementsToValidationSchema(element.children || []);
      }
    } else {
      convertFormElementsToValidationSchema(element.children || [], schema);
    }
  }

  return schema;
};

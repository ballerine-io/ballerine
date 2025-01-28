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
      const schemaElement = {
        id: element.id,
        valueDestination: element.valueDestination,
      } as IValidationSchema;

      if (element.validate) {
        schemaElement.validators = element.validate;
      }

      if (element.children?.length) {
        schemaElement.children = convertFormElementsToValidationSchema(element.children || []);
      }

      schema.push(schemaElement);
    } else {
      convertFormElementsToValidationSchema(element.children || [], schema);
    }
  }

  return schema;
};

import { AnyObject } from '@/common';
import { IValidationSchema, TDeepthLevelStack } from '../../../Validator';
import { contextBuilders } from '../../context-builders';
import { IFormElement } from '../../types';

export interface IContextBuildersMap {
  [key: string]: (context: AnyObject, metadata: AnyObject, stack: TDeepthLevelStack) => AnyObject;
}

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
        metadata: {
          element,
        } as AnyObject,
        getThisContext: contextBuilders[element.element],
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

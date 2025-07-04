import { AnyObject } from '@/common';
import {
  IValidationSchema,
  TBaseValidators,
  TDeepthLevelStack,
  TValidators,
} from '../../../Validator';
import { contextBuilders } from '../../context-builders';
import { TUIElement } from '@ballerine/common';

export interface IContextBuildersMap {
  [key: string]: (context: AnyObject, metadata: AnyObject, stack: TDeepthLevelStack) => AnyObject;
}

const getValueDestination = (element: TUIElement, parent?: TUIElement) => {
  if (parent?.element === 'entityfieldgroup' && element.element === 'documentfield') {
    return `${parent.valueDestination}[$0]`;
  }

  if (element.element === 'documentfield' && !parent) {
    return 'entity.ballerineEntityId';
  }

  return element.valueDestination;
};

export const buildValidationSchemaFromFormElements = (
  elements: Array<TUIElement>,
  schema: IValidationSchema[] = [],
  parent?: TUIElement,
): IValidationSchema[] => {
  const filteredElements = elements.filter(
    element => element.valueDestination || element.children?.length,
  );

  for (let i = 0; i < filteredElements.length; i++) {
    const element = filteredElements[i]!;

    if (element.element === 'entityfieldgroup') {
      const schemaElement = {
        id: element.id,
        valueDestination: getValueDestination(element, parent),
        metadata: {
          element: {
            ...element,
            valueDestination: getValueDestination(element, parent),
          },
        } as AnyObject,
        getThisContext: contextBuilders[element.element],
      } as IValidationSchema;

      if (element.children?.length) {
        schemaElement.children = buildValidationSchemaFromFormElements(
          element.children || [],
          [],
          element,
        );
      }

      schema.push(schemaElement);

      continue;
    }

    if (element.valueDestination) {
      const schemaElement = {
        id: element.id,
        valueDestination: getValueDestination(element, parent),
        metadata: {
          element: {
            ...element,
            valueDestination: getValueDestination(element, parent),
          },
        } as AnyObject,
        getThisContext: contextBuilders[element.element],
      } as IValidationSchema;

      if (element.validate) {
        schemaElement.validators = element.validate as TValidators<TBaseValidators, object>;
      }

      if (element.children?.length) {
        schemaElement.children = buildValidationSchemaFromFormElements(
          element.children || [],
          [],
          element,
        );
      }

      schema.push(schemaElement);
    } else {
      buildValidationSchemaFromFormElements(element.children || [], schema, parent);
    }
  }

  return schema;
};

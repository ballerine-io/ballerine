import { AnyObject } from '@/common';
import { IFormElement } from '../../../../types';
import get from 'lodash/get';
import set from 'lodash/set';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';

export const insertDefaultValues = (
  values: AnyObject,
  schema?: Array<IFormElement<string, any>>,
) => {
  if (!Array.isArray(schema)) {
    return values;
  }

  values = structuredClone(values);

  const insertValuesRecursively = (
    values: AnyObject,
    schema: Array<IFormElement<string, any>>,
    stack: TDeepthLevelStack = [],
  ) => {
    schema.forEach(element => {
      if (!element.valueDestination && !element.children) {
        return;
      }

      const value = get(values, formatValueDestination(element.valueDestination, stack));

      if (value === undefined && element.defaultValue !== undefined) {
        set(values, element.valueDestination, element.defaultValue);
      }

      if (element.children && !element.valueDestination) {
        insertValuesRecursively(values, element.children, stack);
      }
    });

    return values;
  };

  return insertValuesRecursively(values, schema);
};

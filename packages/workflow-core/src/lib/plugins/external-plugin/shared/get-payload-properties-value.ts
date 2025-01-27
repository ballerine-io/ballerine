import get from 'lodash.get';
import { isObject } from '@ballerine/common';

import { TContext } from '../../../utils/types';
import { PluginPayloadProperty } from '../types';

/**
 * Get the value of the properties in the payload depending on the type of the property i.e. 'literal' or 'path'
 * @param properties
 * @param context
 */
export const getPayloadPropertiesValue = ({
  properties,
  context,
}: {
  properties: Record<PropertyKey, PluginPayloadProperty<unknown>>;
  context: TContext;
}) =>
  Object.entries(properties).reduce((acc, [key, property]) => {
    if (!isObject(property)) {
      acc[key] = property;

      return acc;
    }

    if ('__type' in property && property.value === '*') {
      acc[key] = context;

      return acc;
    }

    if ('__type' in property) {
      acc[key] = get(context, property.value);

      return acc;
    }

    acc[key] = getPayloadPropertiesValue({
      properties: property as Record<PropertyKey, PluginPayloadProperty<unknown>>,
      context,
    });

    return acc;
  }, {} as Record<PropertyKey, unknown>);

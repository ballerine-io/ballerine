import { __ROOT__ } from '../constants';
import { get } from 'lodash-es';
import { getPropertyPath } from './get-property-path';

export const generateEditableDetailsV2Fields =
  (obj: Record<PropertyKey, any>) =>
  ({ path, id }: { path: string; id?: string }) => {
    const isWildcardPath = path === '*';
    const objectAtPath = isWildcardPath ? obj : get(obj, path);
    const fields = Object.keys(objectAtPath).map(key => {
      const pathToValue = isWildcardPath ? key : `${path}.${key}`;
      const propertyPath = getPropertyPath({
        obj,
        accessor: proxy => get(proxy, pathToValue),
        propertyId: id,
      });
      const root = isWildcardPath ? __ROOT__ : path;

      if (!root) {
        throw new Error('Root is undefined');
      }

      return {
        ...propertyPath,
        root,
        props: {
          type: undefined,
          format: undefined,
          isEditable: true,
        },
      };
    });

    return fields;
  };

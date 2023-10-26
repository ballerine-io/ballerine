import { AnyObject } from '@ballerine/ui';
import unset from 'lodash/unset';
import get from 'lodash/get';
import set from 'lodash/set';

export const removeDataAndAssignChanges = (context: AnyObject, destination: string) => {
  unset(context, destination);

  const value = get(context, destination);

  // Lodash unset lefts empty values in array
  // Removing them
  if (Array.isArray(value) && value.every(item => item === undefined)) {
    set(context, destination, []);
  }

  return context;
};

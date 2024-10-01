import { isObject } from '@ballerine/common';
import { ArrayOfObjectsWithId, MergeMethod, UnknownRecord } from './types';

const mergeObjects = (obj1: UnknownRecord, obj2: UnknownRecord) => {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (isObject(obj2[key]) && !Array.isArray(obj2[key]) && key in result) {
      result[key] = mergeObjects(result[key] as UnknownRecord, obj2[key] as UnknownRecord);
    } else {
      result[key] = obj2[key];
    }
  }

  return result;
};

export const mergeArraysById = (
  arr1: ArrayOfObjectsWithId,
  arr2: ArrayOfObjectsWithId,
  mergeMethod: MergeMethod = mergeObjects,
) => {
  const combined = [...arr1, ...arr2];
  const ids = Array.from(new Set(combined.map(item => item.id)));

  return ids.map(id => {
    const sameIdItems = combined.filter(item => item.id === id);

    return sameIdItems.reduce(mergeMethod, {});
  });
};

export const mergeArraysByIndex = (
  arr1: unknown[],
  arr2: unknown[],
  mergeMethod: MergeMethod = mergeObjects,
) => {
  const maxLength = Math.max(arr1.length, arr2.length);
  const result = new Array(maxLength);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length && i < arr2.length) {
      // Change here: Check if the elements are basic values or JSON objects
      if (typeof arr1[i] !== 'object' && typeof arr2[i] !== 'object') {
        result[i] = arr2[i];
      } else {
        result[i] = mergeMethod(arr1[i] as UnknownRecord, arr2[i] as UnknownRecord);
      }
    } else {
      result[i] = arr1[i] || arr2[i];
    }
  }

  return result;
};

import { isObject } from '@ballerine/common';
import { ARRAY_MERGE_OPTION } from './consts';
import { ArrayMergeOption, ArrayOfObjectsWithId } from './types';
import { mergeArraysByIndex } from './utils';

type UnknownRecord = Record<PropertyKey, unknown>;

const mergeObjects = (obj1: UnknownRecord, obj2: UnknownRecord, mergeKey = 'id'): UnknownRecord => {
  const result = { ...obj1 }; // Start with a copy of obj1 to avoid mutation

  for (const key in obj2) {
    if (isObject(obj2[key]) && !Array.isArray(obj2[key]) && key in result) {
      result[key] = mergeObjects(result[key] as UnknownRecord, obj2[key] as UnknownRecord);
    } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      result[key] = mergeArraysById(
        obj1[key] as ArrayOfObjectsWithId,
        obj2[key] as ArrayOfObjectsWithId,
        mergeKey,
      );
    } else {
      result[key] = obj2[key];
    }
  }

  return result;
};

const mergeArraysById = (
  arr1: ArrayOfObjectsWithId,
  arr2: ArrayOfObjectsWithId,
  mergeKey = 'id',
): ArrayOfObjectsWithId => {
  if (arr1.every(item => !item[mergeKey]) && arr2.every(item => !item[mergeKey])) {
    return mergeArraysByIndex(arr1, arr2, (a, b) => mergeObjects(a, b, mergeKey));
  }

  const arr1Map = arr1.reduce((acc, item) => {
    if (!item[mergeKey]) return acc;

    const itemId = item[mergeKey];
    acc[itemId as string] = item;

    return acc;
  }, {} as Record<string, UnknownRecord>);

  const arr2Map = arr2.reduce((acc, item) => {
    if (!item[mergeKey]) return acc;

    const itemId = item[mergeKey];
    acc[itemId as string] = item;

    return acc;
  }, {} as Record<string, UnknownRecord>);

  console.log({ arr1Map, arr2Map, arr1, arr2 });

  const uniqueIds = Array.from(
    new Set([...arr1.map(item => item[mergeKey]), ...arr2.map(item => item[mergeKey])]),
  ).filter(Boolean) as string[];

  console.log({ uniqueIds });

  return uniqueIds.map(id =>
    mergeObjects(arr1Map[id] || {}, arr2Map[id] || {}, mergeKey),
  ) as ArrayOfObjectsWithId;
};

export type MergeParams = {
  arrayMergeOption: ArrayMergeOption;
  mergeKey?: string;
};

export const deepMergeWithMutation = (
  val1: UnknownRecord | unknown[],
  val2: UnknownRecord | unknown[],
  params: MergeParams = { arrayMergeOption: ARRAY_MERGE_OPTION.BY_ID, mergeKey: 'id' },
): UnknownRecord | unknown[] => {
  const { mergeKey = 'id', arrayMergeOption } = params;

  // Handle array inputs
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (arrayMergeOption === ARRAY_MERGE_OPTION.REPLACE) {
      return val2;
    } else {
      switch (arrayMergeOption) {
        case ARRAY_MERGE_OPTION.BY_ID: {
          return mergeArraysById(
            val1 as ArrayOfObjectsWithId,
            val2 as ArrayOfObjectsWithId,
            mergeKey,
          );
        }
        case ARRAY_MERGE_OPTION.BY_INDEX:
          return mergeArraysByIndex(val1, val2, (a, b) => mergeObjects(a, b, mergeKey));
        case ARRAY_MERGE_OPTION.CONCAT:
        default:
          return [...val1, ...val2];
      }
    }
  }
  // Handle object inputs
  else if (isObject(val1) && isObject(val2)) {
    const result = { ...val1 }; // Clone val1 to avoid mutation

    for (const key in val2) {
      const val1Child = val1[key];
      const val2Child = val2[key];

      if (Array.isArray(val1Child) && Array.isArray(val2Child)) {
        if (arrayMergeOption === ARRAY_MERGE_OPTION.REPLACE) {
          result[key] = val2[key];
        } else {
          switch (arrayMergeOption) {
            case ARRAY_MERGE_OPTION.BY_ID: {
              result[key] = mergeArraysById(
                val1Child as ArrayOfObjectsWithId,
                val2Child as ArrayOfObjectsWithId,
                mergeKey,
              );
              break;
            }
            case ARRAY_MERGE_OPTION.BY_INDEX:
              result[key] = mergeArraysByIndex(val1Child, val2Child, (a, b) =>
                mergeObjects(a, b, mergeKey),
              );
              break;
            case ARRAY_MERGE_OPTION.CONCAT:
            default:
              result[key] = [...val1Child, ...val2Child];
          }
        }
      } else if (isObject(val2Child) && !Array.isArray(val2Child) && key in result) {
        result[key] = deepMergeWithMutation(
          result[key] as UnknownRecord | unknown[],
          val2Child,
          params,
        );
      } else {
        result[key] = val2[key];
      }
    }

    return result;
  }
  // For all other types of inputs, return the second value
  else {
    return val2;
  }
};

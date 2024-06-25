import { isObject } from '@ballerine/common';
import { ARRAY_MERGE_OPTION } from './consts';
import { ArrayMergeOption, ArrayOfObjectsWithId, UnknownRecord } from './types';
import { mergeArraysById, mergeArraysByIndex } from './utils';

export const deepMergeWithOptions = (
  val1: UnknownRecord | unknown[],
  val2: UnknownRecord | unknown[],
  arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT,
) => {
  // Handle array inputs
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (arrayMergeOption === ARRAY_MERGE_OPTION.REPLACE) {
      return val2;
    } else {
      switch (arrayMergeOption) {
        case ARRAY_MERGE_OPTION.BY_ID: {
          // Merge by_id could not be performed on primite or falsy (null, undefined) values.
          // Checking if some value in the array doesn't include id or falsy and forcing merge by_index strategy
          if (
            val1.some((val: unknown) => !isObject(val) || !val?.id) ||
            val2.some((val: unknown) => !isObject(val) || !val?.id)
          ) {
            return mergeArraysByIndex(val1, val2);
          }

          return mergeArraysById(val1 as ArrayOfObjectsWithId, val2 as ArrayOfObjectsWithId);
        }
        case ARRAY_MERGE_OPTION.BY_INDEX:
          return mergeArraysByIndex(val1, val2);
        case ARRAY_MERGE_OPTION.CONCAT:
        default:
          return [...val1, ...val2];
      }
    }
  }
  // Handle object inputs
  else if (isObject(val1) && isObject(val2)) {
    const result = { ...val1 };

    for (const key in val2) {
      const val1Child = val1[key];
      const val2Child = val2[key];

      if (Array.isArray(val1Child) && Array.isArray(val2Child)) {
        if (arrayMergeOption === ARRAY_MERGE_OPTION.REPLACE) {
          result[key] = val2[key];
        } else {
          switch (arrayMergeOption) {
            case ARRAY_MERGE_OPTION.BY_ID: {
              // Merging arrays of primitives using by_index strategy
              if (
                val1Child.some((val: unknown) => !isObject(val) || !val?.id) ||
                val2Child.some((val: unknown) => !isObject(val) || !val?.id)
              ) {
                result[key] = mergeArraysByIndex(val1Child, val2Child);
                break;
              }

              result[key] = mergeArraysById(val1Child || [], val2Child);
              break;
            }
            case ARRAY_MERGE_OPTION.BY_INDEX:
              result[key] = mergeArraysByIndex(val1Child || [], val2Child);
              break;
            case ARRAY_MERGE_OPTION.CONCAT:
            default:
              result[key] = [...(val1Child || []), ...val2Child];
          }
        }
      } else if (isObject(val2Child) && !Array.isArray(val2Child) && key in result) {
        result[key] = deepMergeWithOptions(
          result[key] as UnknownRecord | unknown[],
          val2Child,
          arrayMergeOption,
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

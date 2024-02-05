import { isObject } from '@ballerine/common';

type UnknownRecord = Record<PropertyKey, unknown>;

const mergeObjects = (obj1: UnknownRecord, obj2: UnknownRecord) => {
  const result = { ...obj1 };

  for (let key in obj2) {
    if (isObject(obj2[key]) && !Array.isArray(obj2[key]) && key in result) {
      result[key] = mergeObjects(result[key] as UnknownRecord, obj2[key] as UnknownRecord);
    } else {
      result[key] = obj2[key];
    }
  }

  return result;
};

type ArrayOfObjectsWithId = (UnknownRecord & { id: unknown })[];

const mergeArraysById = (arr1: ArrayOfObjectsWithId, arr2: ArrayOfObjectsWithId) => {
  const combined = [...arr1, ...arr2];
  const ids = Array.from(new Set(combined.map(item => item.id)));

  return ids.map(id => {
    const sameIdItems = combined.filter(item => item.id === id);
    return sameIdItems.reduce(mergeObjects, {});
  });
};

const mergeArraysByIndex = (arr1: unknown[], arr2: unknown[]) => {
  const maxLength = Math.max(arr1.length, arr2.length);
  const result = new Array(maxLength);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length && i < arr2.length) {
      // Change here: Check if the elements are basic values or JSON objects
      if (typeof arr1[i] !== 'object' && typeof arr2[i] !== 'object') {
        result[i] = arr2[i];
      } else {
        result[i] = mergeObjects(arr1[i] as UnknownRecord, arr2[i] as UnknownRecord);
      }
    } else {
      result[i] = arr1[i] || arr2[i];
    }
  }

  return result;
};

export const deepMergeWithOptions = (
  val1: UnknownRecord | unknown[],
  val2: UnknownRecord | unknown[],
  arrayMergeOption = 'concat',
) => {
  // Handle array inputs
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (arrayMergeOption === 'replace') {
      return val2;
    } else {
      switch (arrayMergeOption) {
        case 'by_id':
          return mergeArraysById(val1 as ArrayOfObjectsWithId, val2 as ArrayOfObjectsWithId);
        case 'by_index':
          return mergeArraysByIndex(val1, val2);
        case 'concat':
        default:
          return [...val1, ...val2];
      }
    }
  }
  // Handle object inputs
  else if (isObject(val1) && isObject(val2)) {
    const result = { ...val1 };

    for (let key in val2) {
      if (Array.isArray(val2[key])) {
        if (arrayMergeOption === 'replace') {
          result[key] = val2[key];
        } else {
          switch (arrayMergeOption) {
            case 'by_id':
              const val1Element = val1[key];
              result[key] = mergeArraysById(
                (val1Element as ArrayOfObjectsWithId) || [],
                val2[key] as ArrayOfObjectsWithId,
              );
              break;
            case 'by_index':
              result[key] = mergeArraysByIndex(
                (val1[key] as unknown[]) || [],
                val2[key] as unknown[],
              );
              break;
            case 'concat':
            default:
              result[key] = [...((val1[key] as unknown[]) || []), ...(val2[key] as unknown[])];
          }
        }
      } else if (isObject(val2[key]) && !Array.isArray(val2[key]) && key in result) {
        result[key] = deepMergeWithOptions(
          result[key] as UnknownRecord,
          val2[key] as UnknownRecord,
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

import { isPlainObject } from 'is-what';

export const recursiveMerge = (objA: any, objB: any) => {
  for (const key in objB) {
    const valueA = objA[key];
    const valueB = objB[key];

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      objA[key] = [...valueA, ...valueB];
      continue;
    }

    if (isPlainObject(valueA) && isPlainObject(valueB)) {
      objA[key] = recursiveMerge(valueA, valueB);
      continue;
    }

    objA[key] = valueB;
  }

  return objA;
};

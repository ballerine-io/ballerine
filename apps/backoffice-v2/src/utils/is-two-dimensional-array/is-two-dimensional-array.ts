export const isTwoDimensionalArray = (
  array: Array<any> | Float32Array,
): array is Array<Array<any>> | Array<Float32Array> => array.every(Array.isArray);

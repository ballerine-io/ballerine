export const isTwoDimensionalArray = (
  array: any[] | Float32Array,
): array is any[][] | Float32Array[] => array.every(Array.isArray);

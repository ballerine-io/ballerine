export function buildSortingRegex(prefix: string): RegExp {
  const regexp = new RegExp(`(${prefix}_(.+))=(asc|desc)`, 'g');

  return regexp;
}

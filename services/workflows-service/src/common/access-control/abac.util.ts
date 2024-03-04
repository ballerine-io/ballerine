import { Permission } from 'accesscontrol';

/**
 * @returns attributes not allowed to appear on given data according to given
 * attributeMatchers
 */
export const getInvalidAttributes = (
  permission: Permission,
  data: Record<string, unknown>,
): string[] => {
  const filteredData = permission.filter(data) as Record<string, unknown>;

  return Object.keys(data).filter(key => !(key in filteredData));
};

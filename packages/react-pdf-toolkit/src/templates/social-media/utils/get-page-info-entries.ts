import { sanitizeString } from '@/utils';

export const getPageInfoEntries = (
  pageInfo: Record<string, unknown>,
): { key: string; value: string }[] => {
  let values: { key: string; value: string }[] = [];

  for (const [key, value] of Object.entries(pageInfo)) {
    if (typeof value === 'object') {
      values = Array.isArray(value)
        ? values.concat({ key, value: String(value) })
        : values.concat(getPageInfoEntries(value as Record<string, unknown>));
    } else {
      values.push({ key, value: String(value) });
    }
  }

  return values.map(value => ({
    ...value,
    value: sanitizeString(value.value),
  }));
};

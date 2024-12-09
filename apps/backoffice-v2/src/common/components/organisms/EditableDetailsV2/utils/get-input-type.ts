import { isValidDatetime } from '@/common/utils/is-valid-datetime';
import { checkIsIsoDate } from '@ballerine/common';
import { checkIsDate } from '@ballerine/ui';

export const getInputType = ({
  format,
  type,
  value,
}: {
  format: string | undefined;
  type: string | undefined;
  value: unknown;
}) => {
  if (format === 'date-time' || isValidDatetime(value)) {
    return 'datetime-local';
  }

  if (format) {
    return format;
  }

  if (type === 'string') {
    return 'text';
  }

  if (type === 'number' || (typeof value === 'number' && Number.isFinite(value))) {
    return 'number';
  }

  if (checkIsDate(value, { isStrict: false }) || checkIsIsoDate(value) || type === 'date') {
    return 'date';
  }

  if (!type) {
    return 'text';
  }

  return type;
};

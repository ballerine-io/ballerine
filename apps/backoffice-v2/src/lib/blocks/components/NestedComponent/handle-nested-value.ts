import { checkIsDate, formatDate } from '@ballerine/ui';
import { checkIsIsoDate, isNullish } from '@ballerine/common';
import dayjs from 'dayjs';

export const handleNestedValue = ({
  value,
  showUndefined,
  showNull,
}: {
  value: unknown;
  showUndefined: boolean;
  showNull: boolean;
}) => {
  if (checkIsDate(value, { isStrict: false }) || checkIsIsoDate(value)) {
    return formatDate(dayjs(value).toDate());
  }

  if (value === undefined && showUndefined) return 'undefined';

  if (value === null && showNull) return 'null';

  if (!isNullish(value)) return value?.toString();
};

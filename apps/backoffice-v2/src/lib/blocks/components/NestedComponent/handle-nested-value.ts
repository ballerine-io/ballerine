import { isValidDate } from '../../../../common/utils/is-valid-date';
import { formatDate } from '../../../../common/utils/format-date';
import { isNullish } from '@ballerine/common';
import { isValidIsoDate } from '../../../../common/utils/is-valid-iso-date/is-valid-iso-date';
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
  if (isValidDate(value, { isStrict: false }) || isValidIsoDate(value)) {
    return formatDate(dayjs(value).toDate());
  }
  if (value === undefined && showUndefined) return 'undefined';
  if (value === null && showNull) return 'null';
  if (!isNullish(value)) return value?.toString();
};

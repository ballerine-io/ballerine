import { checkIsDate } from '../../../../../../../packages/ui/src/common/utils/check-is-date';
import { formatDate } from '../../../../../../../packages/ui/src/common/utils/format-date';
import { isNullish } from '@ballerine/common';
import { checkIsIsoDate } from '../../../../../../../packages/common/src/utils/check-is-iso-date/check-is-iso-date';
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

import { isValidDate } from '../../../../common/utils/is-valid-date';
import { formatDate } from '../../../../common/utils/format-date';
import { isNullish } from '@ballerine/common';

export const handleNestedValue = ({
  value,
  showUndefined,
  showNull,
}: {
  value: unknown;
  showUndefined: boolean;
  showNull: boolean;
}) => {
  if (isValidDate(value)) return formatDate(new Date(value));
  if (value === undefined && showUndefined) return 'undefined';
  if (value === null && showNull) return 'null';
  if (!isNullish(value)) return value?.toString();
};

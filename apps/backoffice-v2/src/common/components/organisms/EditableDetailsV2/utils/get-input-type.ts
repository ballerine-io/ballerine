import { checkIsFormattedDatetime } from '@/common/utils/check-is-formatted-datetime';
import { checkIsDate } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-date';
import { checkIsDatetime } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-datetime';

export const getInputType = ({
  format,
  type,
  value,
}: {
  format: string | undefined;
  type: string | undefined;
  value: unknown;
}) => {
  if (format === 'date-time' || checkIsDatetime(value) || checkIsFormattedDatetime(value)) {
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

  if (checkIsDate(value) || type === 'date') {
    return 'date';
  }

  if (!type) {
    return 'text';
  }

  return type;
};

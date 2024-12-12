import { isNullish } from '@ballerine/common';
import { checkIsDatetime } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-datetime';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getDisplayValue = <TValue, TOriginalValue>({
  value,
  originalValue,
  isEditable,
}: {
  value: TValue;
  originalValue: TOriginalValue;
  isEditable: boolean;
}) => {
  if (isEditable && checkIsDatetime(value)) {
    return dayjs(value).local().format('YYYY-MM-DDTHH:mm:ss');
  }

  if (isEditable) {
    return originalValue;
  }

  if (isNullish(value) || value === '') {
    return 'N/A';
  }

  return value;
};

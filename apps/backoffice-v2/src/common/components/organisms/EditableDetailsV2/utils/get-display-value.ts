import { isNullish } from '@ballerine/common';
import { checkIsDatetime } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-datetime';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getDisplayValue = <TValue, TFormValue>({
  value,
  formValue,
  isEditable,
}: {
  value: TValue;
  formValue: TFormValue;
  isEditable: boolean;
}) => {
  if (isEditable && checkIsDatetime(formValue)) {
    return dayjs(formValue).local().format('YYYY-MM-DDTHH:mm:ss');
  }

  if (isEditable) {
    return formValue;
  }

  if (isNullish(value) || value === '') {
    return 'N/A';
  }

  return value;
};

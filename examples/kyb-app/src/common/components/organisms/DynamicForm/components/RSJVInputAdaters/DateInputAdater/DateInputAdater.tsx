import { RJSVInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { DatePickerInput } from '@ballerine/ui';

export const DateInputAdater: RJSVInputAdapter = ({ formData, onChange }) => {
  return (
    <DatePickerInput
      value={formData ? Number(formData) : undefined}
      onChange={event => void onChange(String(event.target.value))}
    />
  );
};

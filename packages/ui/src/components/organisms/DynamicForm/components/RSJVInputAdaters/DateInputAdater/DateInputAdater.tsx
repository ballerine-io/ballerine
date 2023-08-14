import { DatePickerInput } from '@components/molecules';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const DateInputAdater: RJSVInputAdapter = ({ formData, disabled, onChange }) => {
  return (
    <DatePickerInput
      value={formData ? formData : undefined}
      onChange={event => void onChange(String(event.target.value))}
      disabled={disabled}
    />
  );
};

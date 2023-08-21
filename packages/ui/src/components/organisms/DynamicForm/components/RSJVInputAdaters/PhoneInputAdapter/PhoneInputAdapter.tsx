import { PhoneNumberInput } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const PhoneInputAdapter: RJSVInputAdapter = ({ formData, disabled, onChange }) => {
  return (
    <PhoneNumberInput
      country="us"
      value={formData}
      disabled={disabled}
      enableSearch
      onChange={value => void onChange(value)}
    />
  );
};

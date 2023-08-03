import { PhoneNumberInput } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const PhoneInputAdapter: RJSVInputAdapter = ({ formData, onChange }) => {
  return (
    <PhoneNumberInput country="us" value={formData} onChange={value => void onChange(value)} />
  );
};

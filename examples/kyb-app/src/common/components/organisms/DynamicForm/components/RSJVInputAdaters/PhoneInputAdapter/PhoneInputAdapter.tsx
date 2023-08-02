import { RJSVInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { PhoneNumberInput } from '@ballerine/ui';

export const PhoneInputAdapter: RJSVInputAdapter = ({ formData, label, onChange, ...rest }) => {
  console.log('adapter', rest);
  return (
    <PhoneNumberInput country="us" value={formData} onChange={value => void onChange(value)} />
  );
};

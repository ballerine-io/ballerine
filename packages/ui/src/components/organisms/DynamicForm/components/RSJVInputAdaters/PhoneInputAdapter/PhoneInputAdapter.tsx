import { PhoneNumberInput } from '@/components/atoms';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const PhoneInputAdapter: RJSFInputAdapter = ({
  id,
  formData,
  disabled,
  onChange,
  onBlur,
}) => {
  const handleBlur = useCallback(() => {
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <PhoneNumberInput
      country="us"
      value={formData}
      disabled={disabled}
      enableSearch
      onChange={value => void onChange(value)}
      onBlur={handleBlur}
    />
  );
};

import { PhoneNumberInput } from '@/components/atoms';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const PhoneInputAdapter: RJSFInputAdapter = ({
  id,
  formData,
  disabled,
  testId,
  uiSchema,
  onChange,
  onBlur,
}) => {
  const { defaultCountry = 'us' } = uiSchema || {};

  const handleBlur = useCallback(() => {
    onBlur?.(id as string, formData);
  }, [id, onBlur, formData]);

  return (
    <PhoneNumberInput
      country={defaultCountry}
      value={formData}
      disabled={disabled}
      enableSearch
      onChange={value => void onChange(value)}
      testId={testId}
      onBlur={handleBlur}
    />
  );
};

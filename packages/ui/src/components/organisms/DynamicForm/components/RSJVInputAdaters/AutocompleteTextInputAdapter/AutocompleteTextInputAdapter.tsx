import { AnyObject } from '@/common/types';
import { AutocompleteInput } from '@/components/molecules';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useMemo } from 'react';

export const AutocompleteTextInputAdapter: RJSFInputAdapter = ({
  id,
  disabled,
  formData,
  placeholder,
  uiSchema,
  testId,
  onChange,
  onBlur,
}) => {
  const options = useMemo(() => {
    return uiSchema?.options && Array.isArray(uiSchema?.options)
      ? (uiSchema?.options as AnyObject[]).map(item => ({
          value: item.title as string,
        }))
      : [];
  }, [uiSchema]);

  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <AutocompleteInput
      name={id}
      disabled={disabled}
      value={formData}
      options={options}
      testId={testId}
      placeholder={placeholder || uiSchema?.['ui:placeholder']}
      onChange={event => void onChange(event.target.value || '')}
      onBlur={handleBlur}
    />
  );
};

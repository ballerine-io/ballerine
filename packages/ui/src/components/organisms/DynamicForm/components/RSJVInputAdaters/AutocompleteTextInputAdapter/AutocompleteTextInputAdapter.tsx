import { AnyObject } from '@common/types';
import { AutocompleteInput } from '@components/molecules';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useMemo } from 'react';

export const AutocompleteTextInputAdapter: RJSVInputAdapter = ({
  id,
  disabled,
  formData,
  placeholder,
  uiSchema,
  onChange,
  onBlur,
}) => {
  const options = useMemo(() => {
    return uiSchema.options && Array.isArray(uiSchema.options)
      ? (uiSchema.options as AnyObject[]).map(item => ({
          value: item.title as string,
        }))
      : [];
  }, [uiSchema]);

  const handleBlur = useCallback(() => {
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <AutocompleteInput
      name={id}
      disabled={disabled}
      value={formData}
      options={options}
      placeholder={placeholder || uiSchema['ui:placeholder']}
      onChange={event => void onChange(event.target.value || '')}
      onBlur={handleBlur}
    />
  );
};

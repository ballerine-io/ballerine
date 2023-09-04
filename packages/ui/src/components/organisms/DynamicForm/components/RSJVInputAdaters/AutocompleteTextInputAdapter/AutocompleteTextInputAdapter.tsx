import { AnyObject } from '@common/types';
import { AutocompleteInput } from '@components/molecules';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useMemo } from 'react';

export const AutocompleteTextInputAdapter: RJSVInputAdapter = ({
  id,
  disabled,
  formData,
  placeholder,
  uiSchema,
  onChange,
}) => {
  const options = useMemo(() => {
    return uiSchema.options && Array.isArray(uiSchema.options)
      ? (uiSchema.options as AnyObject[]).map(item => ({
          value: item.title as string,
        }))
      : [];
  }, [uiSchema]);

  return (
    <AutocompleteInput
      name={id}
      disabled={disabled}
      value={formData}
      options={options}
      placeholder={placeholder}
      onChange={event => void onChange(event.target.value || '')}
    />
  );
};

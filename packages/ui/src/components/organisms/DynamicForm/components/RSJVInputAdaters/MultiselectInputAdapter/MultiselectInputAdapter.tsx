import { MultiSelect, MultiSelectOption, MultiSelectValue } from '@components/molecules';
import { RJSFInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useMemo } from 'react';

export const MultiselectInputAdapter: RJSFInputAdapter<MultiSelectValue[]> = ({
  id,
  uiSchema,
  formData,
  onBlur,
  onChange,
}) => {
  const options = useMemo(() => {
    return (Array.isArray(uiSchema.options) ? uiSchema.options : []) as MultiSelectOption[];
  }, [uiSchema.options]);
  const inputValue = useMemo(() => (Array.isArray(formData) ? formData : []), [formData]);

  const handleBlur = useCallback(() => {
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  const handleChange = useCallback(
    (selected: MultiSelectValue[]) => {
      onChange(selected);
    },
    [onChange],
  );

  return (
    <MultiSelect value={inputValue} options={options} onChange={handleChange} onBlur={handleBlur} />
  );
};

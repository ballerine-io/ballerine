import {
  Chip,
  MultiSelect,
  MultiSelectOption,
  MultiSelectProps,
  MultiSelectSelectedItemRenderer,
  MultiSelectValue,
} from '@components/molecules';
import { RJSFInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { X } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export const MultiselectInputAdapter: RJSFInputAdapter<MultiSelectValue[], MultiSelectProps> = ({
  id,
  uiSchema,
  formData,
  onBlur,
  onChange,
  name,
  searchPlaceholder,
  renderSelected,
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

  const selectedItemRenderer = useMemo(() => {
    if (renderSelected) return renderSelected;

    const defaultRenderer: MultiSelectSelectedItemRenderer = (params, option) => {
      return (
        <Chip key={option.value} className="h-6">
          <Chip.Label text={option.title} variant="secondary" />
          <Chip.UnselectButton
            {...params.unselectButtonProps}
            icon={<X className="hover:text-muted-foreground h-3 w-3 text-white" />}
          />
        </Chip>
      );
    };
    return defaultRenderer;
  }, [renderSelected]);

  return (
    <MultiSelect
      name={name}
      searchPlaceholder={searchPlaceholder}
      value={inputValue}
      options={options}
      onChange={handleChange}
      onBlur={handleBlur}
      renderSelected={selectedItemRenderer}
    />
  );
};

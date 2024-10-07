import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import {
  Chip,
  createTestId,
  MultiSelect,
  MultiSelectSelectedItemRenderer,
  MultiSelectValue,
} from '@ballerine/ui';
import { X } from 'lucide-react';
import { FunctionComponent, useCallback, useMemo } from 'react';

export interface IMultiselectFieldOption {
  label: string;
  value: string;
}

export interface IMultiselectFieldOptions {
  options: IMultiselectFieldOption[];
  placeholder?: string;
}

export const MultiselectField: FunctionComponent<
  IFieldComponentProps<MultiSelectValue[], IMultiselectFieldOptions>
> = ({ fieldProps, definition, options: _options, stack }) => {
  const { value, disabled, onChange, onBlur } = fieldProps;
  const { options, placeholder } = _options || {};

  const multiselectOptions = useMemo(
    () =>
      options.map(option => ({
        title: option.label,
        value: option.value,
      })),
    [options],
  );

  const handleChange = useCallback(
    (selected: MultiSelectValue[]) => {
      onChange(selected);
    },
    [onChange],
  );

  const renderSelected: MultiSelectSelectedItemRenderer = useCallback((params, option) => {
    return (
      <Chip key={option.value} className="bg-secondary h-6" variant="primary">
        <Chip.Label text={option.title} className="text-accent" />
        <Chip.UnselectButton
          {...params.unselectButtonProps}
          icon={<X className="hover:text-muted-foreground text-accent h-3 w-3" />}
        />
      </Chip>
    );
  }, []);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <MultiSelect
        options={multiselectOptions}
        searchPlaceholder={placeholder}
        value={value}
        disabled={disabled}
        renderSelected={renderSelected}
        testId={createTestId(definition, stack)}
        onChange={handleChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};

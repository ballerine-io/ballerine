import { WithTestId } from '@/common';
import { ISearchableDropdownOption, SearchableDropdown } from '@/components/atoms';
import { TOneOfItem } from '@/components/organisms/DynamicForm/types/one-of';
import { FieldProps } from '@rjsf/utils';
import { useCallback, useMemo } from 'react';

export const SelectField = ({
  id,
  onChange,
  schema,
  formData,
  uiSchema,
  disabled,
  testId,
  onBlur,
}: WithTestId<FieldProps<string>>) => {
  const options = useMemo((): ISearchableDropdownOption[] => {
    if (Array.isArray(schema.enum)) {
      return schema.enum.map((value, index) => {
        return {
          label: schema.enumNames ? schema.enumNames[index] : value,
          value: value as string,
        };
      });
    }

    if (!Array.isArray(schema.oneOf)) return [];

    return (schema.oneOf as TOneOfItem[]).map(item => {
      return {
        label: item.title as string,
        value: item.const as string,
      };
    }) as ISearchableDropdownOption[];
  }, [schema.oneOf, schema.enumNames, schema.enum]);

  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <SearchableDropdown
      placeholder={uiSchema?.['ui:placeholder']}
      // @ts-ignore
      name={id}
      options={options}
      value={formData}
      disabled={disabled}
      testId={testId}
      textInputClassName="placeholder:text-gray-400"
      onChange={onChange}
      onBlur={handleBlur}
    />
  );
};

import { WithTestId } from '@/common';
import { DropdownInput, DropdownOption } from '@/components/molecules';
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
  const options = useMemo((): DropdownOption[] => {
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
    }) as DropdownOption[];
  }, [schema.oneOf]);

  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <DropdownInput
      placeholdersParams={{ placeholder: uiSchema?.['ui:placeholder'] }}
      searchable
      // @ts-ignore
      name={id}
      options={options}
      value={formData}
      disabled={disabled}
      testId={testId}
      onChange={onChange}
      onBlur={handleBlur}
    />
  );
};

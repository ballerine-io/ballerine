import { Checkbox, RJSFInputProps } from '@ballerine/ui';
import { useMemo } from 'react';

interface CheckboxListOption {
  title: string;
  value: string;
}

export const CheckboxList = (props: RJSFInputProps) => {
  //@ts-nocheck
  const { uiSchema, formData = [], onChange } = props;

  const options = useMemo(() => {
    return (uiSchema['options'] as CheckboxListOption[]) || [];
  }, [uiSchema]);

  return (
    <div className="flex flex-col gap-4">
      {options.map(option => (
        <div className="flex items-center gap-2" key={option.value}>
          <Checkbox
            className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground bg-white"
            color="primary"
            value={option.value}
            checked={Array.isArray(formData) && formData.includes(option.value) ? true : false}
            onCheckedChange={checked => {
              let value = (formData as string[]) || [];

              if (value.includes(option.value)) {
                value = value.filter(val => val !== option.value);
              } else {
                value.push(option.value);
              }

              onChange(value);
            }}
          />
          <span className="font-inter text-sm">{option.title}</span>
        </div>
      ))}
    </div>
  );
};

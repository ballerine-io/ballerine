import { Label } from '@/components/atoms';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { TOneOfItem } from '@/components/organisms/DynamicForm/types/one-of';
import { useMemo } from 'react';

export const RadioInputAdapter: RJSFInputAdapter<string> = ({
  id,
  schema,
  formData,
  disabled,
  testId,
  onBlur,
  onChange,
}) => {
  const options = useMemo(
    () => (schema?.oneOf as TOneOfItem[])?.map(item => ({ label: item.title, value: item.const })),
    [schema],
  );

  return !!options?.length ? (
    <RadioGroup
      value={formData}
      onValueChange={onChange}
      onBlur={() => onBlur(id as string, formData)}
      disabled={disabled}
      data-testid={testId ? `${testId}-radio-group` : undefined}
    >
      {options.map(({ value, label }) => (
        <div
          className="flex items-center space-x-2"
          key={`radio-group-item-${value}`}
          data-testid={testId ? `${testId}-radio-group-item` : undefined}
        >
          <RadioGroupItem value={value} id={`radio-group-item-${value}`}></RadioGroupItem>
          <Label htmlFor={`radio-group-item-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ) : null;
};

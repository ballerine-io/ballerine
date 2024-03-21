import { Checkbox } from '@/components/atoms';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { ctw } from '@/utils/ctw';
import { useCallback } from 'react';

export const BooleanFieldAdapter: RJSFInputAdapter<boolean> = ({
  id,
  formData,
  schema,
  disabled,
  testId,
  onChange,
  onBlur,
}) => {
  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <label
      className={ctw('flex flex-row items-center gap-3', {
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <Checkbox
        className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground bg-white"
        color="primary"
        checked={formData}
        disabled={disabled}
        data-test-id={testId}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
        onBlur={handleBlur}
      />
      <span>{schema.title}</span>
    </label>
  );
};

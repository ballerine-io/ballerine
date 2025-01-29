import { useCallback } from 'react';

import { ctw } from '@/common/utils/ctw';
import { Checkbox } from '@/components/atoms';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const BooleanFieldAdapter: RJSFInputAdapter<boolean> = ({
  id,
  formData,
  schema,
  uiSchema,
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
        className="border bg-white data-[state=checked]:bg-white data-[state=checked]:text-black"
        color="primary"
        checked={formData}
        disabled={disabled}
        data-testid={testId}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
        onBlur={handleBlur}
      />
      <span className={ctw(uiSchema?.className)}>{schema.title}</span>
    </label>
  );
};

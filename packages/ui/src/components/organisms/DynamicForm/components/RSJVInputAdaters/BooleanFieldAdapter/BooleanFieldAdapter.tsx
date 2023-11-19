import { Checkbox } from '@/components/atoms';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const BooleanFieldAdapter: RJSFInputAdapter<boolean> = ({
  id,
  formData,
  schema,
  onChange,
  onBlur,
}) => {
  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <label className="flex flex-row items-center gap-3">
      <Checkbox
        className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground bg-white"
        color="primary"
        checked={formData}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
        onBlur={handleBlur}
      />
      <span>{schema.title}</span>
    </label>
  );
};

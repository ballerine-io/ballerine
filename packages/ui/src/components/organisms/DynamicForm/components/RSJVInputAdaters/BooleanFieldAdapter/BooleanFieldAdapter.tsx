import { Checkbox } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const BooleanFieldAdapter: RJSVInputAdapter<boolean> = ({
  id,
  formData,
  schema,
  onChange,
  onBlur,
}) => {
  const handleBlur = useCallback(() => {
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <label className="flex flex-row items-center gap-3">
      <Checkbox
        className="border-secondary bg-white data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
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

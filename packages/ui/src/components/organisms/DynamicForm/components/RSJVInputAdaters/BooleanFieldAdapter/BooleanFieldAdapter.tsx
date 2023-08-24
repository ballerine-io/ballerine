import { Checkbox } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const BooleanFieldAdapter: RJSVInputAdapter<boolean> = ({ formData, schema, onChange }) => {
  return (
    <label className="flex flex-row items-center gap-3">
      <Checkbox
        className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
        color="primary"
        checked={formData}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
      />
      <span>{schema.title}</span>
    </label>
  );
};

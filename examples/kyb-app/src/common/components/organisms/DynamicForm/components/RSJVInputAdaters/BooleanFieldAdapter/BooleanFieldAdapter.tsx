import { RJSVInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { Checkbox } from '@ballerine/ui';
import '@ballerine/ui/dist/style.css';

export const BooleanFieldAdapter: RJSVInputAdapter<boolean> = ({
  formData,
  uiSchema,
  schema,
  onChange,
}) => {
  console.log('schema', schema);

  return (
    <div className="flex flex-row items-center gap-3">
      <Checkbox
        className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
        color="primary"
        checked={formData}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
      />
      <span>{schema.description}</span>
    </div>
  );
};

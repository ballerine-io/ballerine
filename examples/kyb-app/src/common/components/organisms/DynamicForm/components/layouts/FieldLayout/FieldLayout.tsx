import { ErrorsList } from '@app/common/components/organisms/DynamicForm/components/molecules/ErrorsList';
import { useWarnings } from '@app/common/components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
import { Label } from '@ballerine/ui';
import { FieldTemplateProps } from '@rjsf/utils';

export const FieldLayout = ({
  id,
  label,
  children,
  displayLabel,
  rawErrors,
}: FieldTemplateProps) => {
  const { fieldWarnings } = useWarnings(id);

  return (
    <div className="flex flex-col gap-2 py-2">
      <div>{displayLabel ? <Label htmlFor={id}>{label}</Label> : null}</div>
      <div>{children}</div>
      {rawErrors ? <ErrorsList errors={rawErrors} className="capitalize" /> : null}
      {fieldWarnings ? (
        <ErrorsList
          errors={Array.isArray(fieldWarnings) ? fieldWarnings : [fieldWarnings]}
          type="warning"
        />
      ) : null}
    </div>
  );
};

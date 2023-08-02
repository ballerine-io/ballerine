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
  description,
  uiSchema,
}: FieldTemplateProps) => {
  const { fieldWarnings } = useWarnings(id);

  const isLabelEnabled = displayLabel || (uiSchema && uiSchema['ui:label']);

  return (
    <div className="flex flex-col gap-3 py-3">
      {isLabelEnabled ? <Label htmlFor={id}>{label}</Label> : null}
      {children}
      {rawErrors ? <ErrorsList errors={rawErrors} className="capitalize" /> : null}
      {fieldWarnings ? (
        <ErrorsList
          errors={Array.isArray(fieldWarnings) ? fieldWarnings : [fieldWarnings]}
          type="warning"
        />
      ) : null}
      <p className="font-inter text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

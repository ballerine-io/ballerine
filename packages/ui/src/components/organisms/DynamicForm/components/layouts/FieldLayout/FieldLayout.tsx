import { Label } from '@components/atoms';
import { ErrorsList } from '@components/organisms/DynamicForm/components/molecules/ErrorsList';
import { useWarnings } from '@components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
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
    <div className="flex flex-col gap-3 py-1">
      {isLabelEnabled ? <Label htmlFor={id}>{label}</Label> : null}
      {children}
      {rawErrors ? <ErrorsList errors={rawErrors} className="capitalize" /> : null}
      {fieldWarnings ? (
        <ErrorsList
          errors={Array.isArray(fieldWarnings) ? fieldWarnings : [fieldWarnings]}
          type="warning"
        />
      ) : null}
      <span className="font-inter text-muted-foreground text-sm">{description}</span>
    </div>
  );
};

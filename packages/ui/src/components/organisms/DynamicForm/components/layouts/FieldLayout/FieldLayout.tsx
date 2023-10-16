import { Label } from '@components/atoms';
import { ErrorsList } from '@components/molecules/ErrorsList';
import { useWarnings } from '@components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';

export const FieldLayout = ({
  id,
  label,
  children,
  displayLabel,
  rawErrors,
  description,
  uiSchema,
  required,
}: FieldTemplateProps) => {
  const { fieldWarnings } = useWarnings(id);

  const isLabelEnabled = displayLabel || (uiSchema && uiSchema['ui:label']);

  // Removing error duplicates for oneOf validation
  const errors = useMemo(() => Array.from(new Set(rawErrors)), [rawErrors]);

  return (
    <div className="flex flex-col gap-3 py-1">
      {isLabelEnabled ? (
        <Label htmlFor={id}>
          {label}
          {required ? '' : <span className="opacity-50">{' (optional) '}</span>}
        </Label>
      ) : null}
      {children}
      {rawErrors ? <ErrorsList errors={errors} /> : null}
      {fieldWarnings ? (
        <ErrorsList
          errors={Array.isArray(fieldWarnings) ? fieldWarnings : [fieldWarnings]}
          type="warning"
        />
      ) : null}
      {description && description?.props?.description ? (
        <span className="font-inter text-muted-foreground text-sm">{description}</span>
      ) : null}
    </div>
  );
};

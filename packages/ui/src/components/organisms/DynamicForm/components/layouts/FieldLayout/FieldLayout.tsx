import { Label } from '@/components/atoms';
import { ErrorsList } from '@/components/molecules/ErrorsList';
import { useWarnings } from '@/components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { InputWarning } from '@/components';

export const FieldLayout = ({
  id,
  label,
  children,
  displayLabel,
  rawErrors,
  description,
  uiSchema,
  required,
  optionalLabel = ' (optional) ',
}: FieldTemplateProps & { optionalLabel?: string }) => {
  const { fieldWarnings } = useWarnings(id);

  const isLabelEnabled = displayLabel || (uiSchema && uiSchema['ui:label']);

  // Removing error duplicates for oneOf validation
  const errors = useMemo(() => Array.from(new Set(rawErrors)), [rawErrors]);

  return (
    <div className="flex flex-col gap-1 py-3">
      {isLabelEnabled ? (
        <Label htmlFor={id}>
          {label}
          {required ? '' : <span className="opacity-50">{optionalLabel}</span>}
        </Label>
      ) : null}
      {children}
      {rawErrors ? <ErrorsList errors={errors} /> : null}
      {fieldWarnings ? (
        <ErrorsList
          errors={
            Array.isArray(fieldWarnings)
              ? (fieldWarnings as unknown as Extract<InputWarning, string[]>)
              : [fieldWarnings as unknown as Extract<InputWarning, string>]
          }
          type="warning"
        />
      ) : null}
      {description && description?.props?.description ? (
        <span className="font-inter text-muted-foreground pl-1 text-xs">{description}</span>
      ) : null}
    </div>
  );
};

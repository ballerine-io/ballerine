import { InputWarning } from '@/components';
import { Label } from '@/components/atoms';
import { ErrorsList } from '@/components/molecules/ErrorsList';
import { useWarnings } from '@/components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
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
  schema,
  optionalLabel = ' (optional) ',
}: FieldTemplateProps & { optionalLabel?: string }) => {
  const { fieldWarnings } = useWarnings(id);

  const isLabelEnabled = displayLabel || (uiSchema && uiSchema['ui:label']);
  const { useRawDescription = false } = uiSchema || {};

  // Removing error duplicates for oneOf validation
  const errors = useMemo(() => Array.from(new Set(rawErrors)), [rawErrors]);

  return (
    <div className="flex flex-col gap-2 py-3">
      {isLabelEnabled && (
        <Label htmlFor={id}>
          {label}
          {required ? '' : <span className="opacity-50">{optionalLabel}</span>}
        </Label>
      )}
      {children}
      {!!rawErrors?.length && <ErrorsList errors={errors} />}
      {fieldWarnings && (
        <ErrorsList
          errors={
            Array.isArray(fieldWarnings)
              ? (fieldWarnings as unknown as Extract<InputWarning, string[]>)
              : [fieldWarnings as unknown as Extract<InputWarning, string>]
          }
          type="warning"
        />
      )}
      {!!description &&
        !!description?.props?.description &&
        (useRawDescription && schema.description ? (
          <span
            className="font-inter text-muted-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: schema.description }}
          />
        ) : (
          <span className="font-inter text-muted-foreground text-sm">{description}</span>
        ))}
    </div>
  );
};

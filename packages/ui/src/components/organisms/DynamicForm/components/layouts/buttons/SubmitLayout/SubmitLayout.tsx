import { SubmitButton } from '@/components/molecules/SubmitButton';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import clsx from 'clsx';

export const SubmitLayout = ({ uiSchema }: SubmitButtonProps) => {
  const { norender, submitText, props } = getSubmitButtonOptions(uiSchema);
  const disabled = Boolean(uiSchema?.['ui:options']?.submitButtonOptions?.props?.disabled);
  // @ts-ignore
  // 'isLoading' does not exist on 'submitButtonOptions'
  const isLoading = !!uiSchema?.['ui:options']?.submitButtonOptions?.isLoading;

  if (norender) return null;

  return (
    <div className={clsx('flex justify-end', props?.layoutClassName)}>
      <SubmitButton
        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
        loaderClassName="text-secondary-foreground"
        disabled={disabled}
        isLoading={isLoading}
      >
        {submitText}
      </SubmitButton>
    </div>
  );
};

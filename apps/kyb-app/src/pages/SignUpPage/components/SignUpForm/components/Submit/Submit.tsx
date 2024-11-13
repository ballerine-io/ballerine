import { useSignupLayout } from '@/common/components/layouts/Signup';
import { Button, ctw } from '@ballerine/ui';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import { FunctionComponent } from 'react';

export const Submit: FunctionComponent<SubmitButtonProps> = ({ uiSchema }) => {
  const { themeParams } = useSignupLayout();
  const { norender, submitText, props } = getSubmitButtonOptions(uiSchema);
  const disabled = Boolean(uiSchema?.['ui:options']?.submitButtonOptions?.props?.disabled);
  // @ts-ignore
  // 'isLoading' does not exist on 'submitButtonOptions'
  const isLoading = !!uiSchema?.['ui:options']?.submitButtonOptions?.isLoading;

  if (norender) return null;

  return (
    <div className={ctw('flex justify-end', props?.layoutClassName)}>
      <Button
        type="submit"
        className="bg-black text-white shadow-sm hover:bg-black/80"
        loaderClassName="text-secondary-foreground"
        disabled={disabled}
        isLoading={isLoading}
      >
        {themeParams?.form?.submitText || submitText}
      </Button>
    </div>
  );
};

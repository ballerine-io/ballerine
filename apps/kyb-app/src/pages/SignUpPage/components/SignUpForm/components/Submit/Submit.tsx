import { useSignupLayout } from '@/common/components/layouts/Signup';
import { Button, ctw } from '@ballerine/ui';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import { FunctionComponent } from 'react';
import { useSignupForm } from '../SignUpFormProvider';

export const Submit: FunctionComponent<SubmitButtonProps> = ({ uiSchema }) => {
  const { themeParams } = useSignupLayout();
  const { norender, submitText, props } = getSubmitButtonOptions(uiSchema);
  const { isLoading: isSignupLoading } = useSignupForm();

  if (norender) return null;

  return (
    <div className={ctw('flex items-center justify-end', props?.layoutClassName)}>
      <Button
        type="submit"
        className="bg-black text-white shadow-sm hover:bg-black/80"
        loaderClassName="text-secondary-foreground"
        disabled={isSignupLoading}
      >
        {themeParams?.form?.submitText || submitText}
      </Button>
    </div>
  );
};

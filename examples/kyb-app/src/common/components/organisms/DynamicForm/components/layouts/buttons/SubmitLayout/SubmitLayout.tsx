import { Button } from '@ballerine/ui';
import { SubmitButtonProps, getSubmitButtonOptions } from '@rjsf/utils';

export const SubmitLayout = ({ uiSchema }: SubmitButtonProps) => {
  const { norender, submitText } = getSubmitButtonOptions(uiSchema);

  if (norender) return null;

  console.log('submit layout');

  return (
    <div className="flex justify-end">
      <Button
        // TO DO: checkout why variant isnt working as intended
        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
        type="submit"
      >
        {/* {submitText} */}
        loading
      </Button>
    </div>
  );
};

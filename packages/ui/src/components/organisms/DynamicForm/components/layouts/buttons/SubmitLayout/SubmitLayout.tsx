import { Button } from '@components/atoms';
import { SubmitButtonProps, getSubmitButtonOptions } from '@rjsf/utils';

export const SubmitLayout = ({ uiSchema }: SubmitButtonProps) => {
  const { norender, submitText } = getSubmitButtonOptions(uiSchema);

  if (norender) return null;

  return (
    <div className="flex justify-end">
      <Button
        // TO DO: checkout why variant isnt working as intended
        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
        type="submit"
      >
        {submitText}
      </Button>
    </div>
  );
};

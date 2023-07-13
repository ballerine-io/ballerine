import { Button } from '@ballerine/ui';
import { SubmitButtonProps, getSubmitButtonOptions } from '@rjsf/utils';

export const SubmitLayout = ({ uiSchema }: SubmitButtonProps) => {
  const { norender, submitText } = getSubmitButtonOptions(uiSchema);

  if (norender) return null;

  return (
    <div className="flex justify-end">
      <Button type="submit">{submitText}</Button>
    </div>
  );
};

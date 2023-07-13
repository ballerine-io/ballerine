import { Button } from '@ballerine/ui';
import { SubmitButtonProps, getSubmitButtonOptions } from '@rjsf/utils';

export const SubmitButtonLayout = ({ uiSchema }: SubmitButtonProps) => {
  const { norender, submitText } = getSubmitButtonOptions(uiSchema);

  if (norender) return null;

  return <Button type="submit">{submitText}</Button>;
};

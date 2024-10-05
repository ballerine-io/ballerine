import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';

export const useValidatedInput = (element: UIElement) => {
  const { errors } = useValidator();

  return errors[element.getId()];
};

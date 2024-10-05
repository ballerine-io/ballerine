import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useStack } from '@/pages/CollectionFlowV2/components/ui/fields/FieldList/providers/StackProvider';
import { useTouched } from '@/pages/CollectionFlowV2/hocs/withConnectedField';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { ErrorsList } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface IFieldErrorsProps {
  definition: UIElementV2;
  stack?: number[];
}

export const FieldErrors: FunctionComponent<IFieldErrorsProps> = ({ definition }) => {
  const { payload } = useStateManagerContext();
  const { stack } = useStack();
  const uiElement = useUIElement(definition, payload, stack);
  const { isTouched } = useTouched(uiElement);
  const errors = useValidatedInput(uiElement);
  const { errors: _validationErrors } = useValidator();

  return isTouched && <ErrorsList errors={errors || []} />;
};

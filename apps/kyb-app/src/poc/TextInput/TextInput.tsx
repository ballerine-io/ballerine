import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { Input } from '@ballerine/ui';
import { set } from 'lodash';
import { FunctionComponent, useCallback, useMemo } from 'react';

export interface ITextInputProps {
  context: object;
  element: UIElementV2;
  stack?: number[];
}

export const TextInput: FunctionComponent<ITextInputProps> = ({ context, element, stack = [] }) => {
  const uiElement = useMemo(() => new UIElement(element, context, stack), [element, context]);
  const validationError = useValidatedInput(uiElement);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      set(context, uiElement.getValueDestination(), event.target.value);
    },
    [context, uiElement],
  );

  return (
    <div className="flex flex-col gap-1">
      <label>{uiElement.getId()}</label>
      <Input type="text" onChange={handleChange} />
      {validationError && <span className="text-red-500">{validationError}</span>}
    </div>
  );
};

import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { FunctionComponent, useMemo } from 'react';

interface IFieldListProps {
  element: UIElementV2;
  children: any;
  context: any;
  stack?: number[];
}

export const FieldList: FunctionComponent<IFieldListProps> = ({
  element,
  context,
  children,
  stack = [],
}) => {
  const uiElement = useMemo(
    () => new UIElement(element, context, stack),
    [element, context, stack],
  );
  const error = useValidatedInput(uiElement);

  return (
    <div className="flex flex-col gap-2">
      <label>Field List ID: {uiElement.getId()}</label>
      <label>Field List Value Destination: {uiElement.getValueDestination()}</label>
      {children}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

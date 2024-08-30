import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { ctw, Label } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';

export interface IFieldLayoutBaseParams {
  label?: string;
}

export interface IFieldLayoutProps<TFieldParams extends IFieldLayoutBaseParams> {
  definition: UIElementV2<TFieldParams>;
  stack?: number[];
  children: React.ReactNode[] | React.ReactNode;
}

export const FieldLayout: FunctionComponent<IFieldLayoutProps<IFieldLayoutBaseParams>> = ({
  definition,
  stack,
  children,
}) => {
  const { payload } = useStateManagerContext();
  const uiElement = useUIElement(definition, payload, stack);
  const isRequired = useMemo(() => uiElement.isRequired(), [uiElement]);
  const { label } = definition.options || {};

  return (
    <div className={ctw('flex flex-col', { 'gap-4': Boolean(label) })}>
      <div>
        {label && (
          <Label
            id={`label-${uiElement.getId()}`}
            htmlFor={uiElement.getId()}
            className={ctw({ 'opacity-50': !isRequired })}
          >
            {`${isRequired ? label : `${label} (optional)`} `}
          </Label>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

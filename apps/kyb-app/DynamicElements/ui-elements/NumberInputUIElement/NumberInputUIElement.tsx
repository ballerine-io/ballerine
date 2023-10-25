import { useDynamicUIContext } from '@app/components/organisms/DynamicElements/hooks/useDynamicUIContext';
import { useUIElement } from '@app/components/organisms/DynamicElements/hooks/useUIElement';
import { UIElementComponent } from '@app/components/organisms/DynamicElements/types';
import { AnyObject, Input, Label } from '@ballerine/ui';

export interface NumberInputParams {
  title: string;
  placeholder: string;
}

export const NumberInputUIElement: UIElementComponent<NumberInputParams> = ({
  definition,
  actions,
}) => {
  const { context } = useDynamicUIContext<AnyObject>();
  const { handlers, props } = useUIElement(definition, actions, context);

  return (
    <Label className="flex flex-col gap-2">
      <p>{definition.options.title}</p>
      <Input
        placeholder={definition.options.placeholder}
        onChange={handlers.onChange}
        name={definition.name}
        disabled={props.disabled}
        value={(context[definition.name] as string) || ''}
        type="number"
      />
    </Label>
  );
};

import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { UIElementDefinition as TUIElement } from '@/domains/collection-flow';
import { useElementDefinition } from '@/pages/CollectionFlowV2/hooks/useElementDefinition';
import { useFieldIndex } from '@/pages/CollectionFlowV2/hooks/useFieldIndex';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { useUIElementHandlers } from '@/pages/CollectionFlowV2/hooks/useUIElementsHandlers';
import { AnyObject, ErrorsList, RJSFInputAdapter, RJSFInputProps } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';

export type DynamicUIComponent<TProps, TParams = AnyObject> = React.ComponentType<
  TProps & { definition: TUIElement<TParams> }
>;

export const withDynamicUIInputV2 = (
  Component: RJSFInputAdapter<any, any> & { inputIndex?: number | null; testId?: string },
) => {
  function Wrapper(props: RJSFInputProps) {
    const inputId = (props.idSchema as AnyObject)?.$id as string;
    const { name, onChange } = props;

    const { payload } = useStateManagerContext();
    const { currentPage } = usePageResolverContext();
    const { state } = useDynamicUIContext();

    const inputIndex = useFieldIndex(inputId);
    const definition = useElementDefinition(name, currentPage?.elements || []);
    const uiElement = useUIElement(
      definition,
      payload,
      inputIndex !== null ? [inputIndex] : undefined,
    );

    const { state: elementState, setState: setElementState } = useUIElementState(definition);

    const setTouched = useCallback(
      (touched: boolean) => {
        setElementState(uiElement.getId(), { ...elementState, isTouched: touched });
      },
      [uiElement, elementState, setElementState],
    );

    const { disabled } = useUIElementProps(definition);

    const { onChangeHandler } = useUIElementHandlers(uiElement, definition);

    const handleChange = useCallback(
      (value: unknown) => {
        const evt = {
          target: {
            name: definition.name,
            value: !value && value !== 0 && value !== false ? undefined : value,
          },
        };
        onChangeHandler(evt as React.ChangeEvent<any>);
        onChange(value);
      },
      [definition.name, onChange, onChangeHandler],
    );

    const handleBlurSetTouched = useCallback(() => {
      setTouched(true);
    }, [setTouched]);

    const value = useMemo(() => uiElement.getValue() as unknown, [uiElement]);
    const errors = useValidatedInput(uiElement);

    return (
      <div className="flex flex-col gap-2">
        <Component
          {...props}
          disabled={disabled || props.disabled || state.isLoading}
          formData={value}
          definition={definition}
          inputIndex={inputIndex}
          testId={definition.name}
          onChange={handleChange}
          onBlur={handleBlurSetTouched}
        />
        {elementState.isTouched && errors?.length && (
          <ErrorsList testId={definition.name} errors={errors} />
        )}
      </div>
    );
  }

  return Wrapper;
};

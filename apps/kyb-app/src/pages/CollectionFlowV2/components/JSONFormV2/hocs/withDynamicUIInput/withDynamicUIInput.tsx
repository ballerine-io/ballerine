import { ARRAY_VALUE_INDEX_PLACEHOLDER } from '@/common/consts/consts';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { UIElement as TUIElement } from '@/domains/collection-flow';
import { transformV1UIElementToV2UIElement } from '@/pages/CollectionFlowV2/helpers';
import { useUIElementHandlers } from '@/pages/CollectionFlowV2/hooks/useUIElementsHandlers';
import { AnyObject, ErrorsList, RJSFInputAdapter, RJSFInputProps } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';

const findLastDigit = (str: string) => {
  const digitRegex = /_(\d+)_/g;
  const matches = digitRegex.exec(str);

  if (matches && matches.length > 0) {
    // @ts-ignore
    const result = parseInt(matches[matches.length - 1]);
    return result;
  }

  return null;
};

const getInputIndex = (inputId: string) => findLastDigit(inputId);

const injectIndexToDestinationIfNeeded = (destination: string, index: number | null): string => {
  if (index === null) return destination;

  const result = destination.replace(ARRAY_VALUE_INDEX_PLACEHOLDER, `${index}`);

  return result;
};

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
    const inputIndex = useMemo(() => {
      const index = getInputIndex(inputId || '');

      return isNaN(index as number) ? null : index;
    }, [inputId]);

    const baseDefinition = useMemo(() => {
      const definition = findDefinitionByName(
        name,
        // @ts-ignore
        currentPage?.elements,
      );

      if (!definition) throw new Error('definition not found');

      return definition;
    }, [name, currentPage]);

    const uiElement = useMemo(
      () =>
        new UIElement(
          transformV1UIElementToV2UIElement(baseDefinition),
          payload,
          inputIndex !== null ? [inputIndex] : [],
        ),
      [baseDefinition, inputIndex, payload],
    );

    const { state: elementState, setState: setElementState } = useUIElementState(baseDefinition);

    const setTouched = useCallback(
      (touched: boolean) => {
        setElementState(uiElement.getId(), { ...elementState, isTouched: touched });
      },
      [uiElement, elementState, setElementState],
    );

    const { disabled } = useUIElementProps(baseDefinition);

    const { onChangeHandler } = useUIElementHandlers(uiElement, baseDefinition);

    const handleChange = useCallback(
      (value: unknown) => {
        const evt = {
          target: {
            name: baseDefinition.name,
            value: !value && value !== 0 && value !== false ? undefined : value,
          },
        };
        onChangeHandler(evt as React.ChangeEvent<any>);
        onChange(value);
      },
      [baseDefinition.name, onChange, onChangeHandler],
    );

    const handleBlur = useCallback(() => {
      setTouched(true);
    }, [setTouched]);

    const value = useMemo(() => uiElement.getValue() as unknown, [uiElement]);

    const errors = useValidatedInput(uiElement);
    // const { validationErrors, warnings } = useUIElementErrors(definition)
    return (
      <div className="flex flex-col gap-2">
        <Component
          {...props}
          disabled={disabled || props.disabled || state.isLoading}
          formData={value}
          definition={baseDefinition}
          inputIndex={inputIndex}
          testId={baseDefinition.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* {!!warnings.length && <ErrorsList errors={warnings.map(err => err.message)} />} */}
        {errors?.length && <ErrorsList testId={baseDefinition.name} errors={errors} />}
      </div>
    );
  }

  return Wrapper;
};

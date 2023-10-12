import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { findDefinitionByName } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { useUIElementHandlers } from '@app/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { RJSVInputProps, AnyObject } from '@ballerine/ui';
import { useCallback, useMemo, useState } from 'react';
import get from 'lodash/get';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementProps } from '@app/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElement } from '@app/domains/collection-flow';
import { usePageContext } from '@app/components/organisms/DynamicUI/Page';

const findLastDigit = (str: string) => {
  const digitRegex = /\d+/g;
  const matches = str.match(digitRegex);

  if (matches && matches.length > 0) {
    return parseInt(matches[matches.length - 1]);
  }

  return null;
};

const getInputIndex = (inputId: string) => findLastDigit(inputId);

const injectIndexToDestinationIfNeeded = (destination: string, index: number | null): string => {
  if (index === null) return destination;

  const indexPath = `[${index}]`;
  const pathElements = destination.split('.');
  pathElements.splice(pathElements.length - 1, 0, indexPath);

  return pathElements.join('.').replace(`.${indexPath}.`, indexPath);
};

export const withDynamicUIInterceptor = (
  Component: React.ComponentType<
    RJSVInputProps | (RJSVInputProps & { definition?: UIElement<AnyObject> })
  >,
) => {
  function Wrapper(props: RJSVInputProps) {
    const inputId = (props.idSchema as AnyObject)?.$id as string;
    const [isTouched, setTouched] = useState(false);
    const { name, onChange } = props;
    const { payload } = useStateManagerContext();
    const { currentPage } = usePageResolverContext();
    const { errors, pageErrors } = usePageContext();

    const baseDefinition = useMemo(() => {
      const definition = findDefinitionByName(name, currentPage.elements);

      if (!definition) throw new Error('definition not found');

      return definition;
    }, [name, currentPage]);

    const definition = useMemo(() => {
      return {
        ...baseDefinition,
        valueDestination: injectIndexToDestinationIfNeeded(
          baseDefinition.valueDestination,
          getInputIndex(inputId || ''),
        ),
      };
    }, [baseDefinition, inputId]);

    const { disabled } = useUIElementProps(baseDefinition);

    const { onChangeHandler } = useUIElementHandlers(definition);

    const handleChange = useCallback((value: unknown) => {
      const evt = {
        target: {
          name: definition.name,
          value: !value && value !== 0 && value !== false ? undefined : value,
        },
      };
      onChangeHandler(evt as React.ChangeEvent<any>);
      onChange(value);
      setTouched(true);
    }, []);

    const value = useMemo(
      () => get(payload, definition.valueDestination) as any,
      [payload, definition],
    );

    const error = useMemo(() => {
      const validationError = errors[definition.valueDestination]?.message;

      if (validationError) return { message: validationError };

      const revisionResult = pageErrors[currentPage.stateName];

      if (!revisionResult) return null;

      const revisionMessage = revisionResult[definition.valueDestination]?.message;

      if (revisionMessage) {
        return {
          type: 'warning',
          message: revisionMessage,
        };
      }

      return null;
    }, [errors, pageErrors, currentPage, definition]);

    return (
      <div>
        <Component
          {...props}
          disabled={disabled || props.disabled}
          formData={value}
          definition={definition}
          onChange={handleChange}
        />
        {isTouched || value || error?.type === 'warning' ? (
          <p className="text-destructive text-[0.8rem] pl-1 pt-1">{error?.message}</p>
        ) : null}
      </div>
    );
  }

  return Wrapper;
};

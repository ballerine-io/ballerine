import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { findDefinitionByName } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { useUIElementHandlers } from '@app/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { RJSVInputProps } from '@ballerine/ui';
import { useCallback, useEffect, useMemo } from 'react';
import get from 'lodash/get';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';

export const withDynamicUIInterceptor = (Component: React.ComponentType<RJSVInputProps>) => {
  function Wrapper(props: RJSVInputProps) {
    const { name, onChange } = props;
    const { payload } = useStateManagerContext();
    const { currentPage } = usePageResolverContext();
    const definition = useMemo(() => {
      const definition = findDefinitionByName(name, currentPage.elements);

      if (!definition) throw new Error('definition not found');

      return definition;
    }, [name, currentPage]);

    const { onChangeHandler } = useUIElementHandlers(definition);

    const handleChange = useCallback((value: unknown) => {
      const evt = {
        target: {
          name: definition.name,
          value,
        },
      };
      onChangeHandler(evt as React.ChangeEvent<any>);
      onChange(value);
    }, []);

    const value = useMemo(
      () => get(payload, definition.valueDestination) as any,
      [payload, definition],
    );

    return <Component {...props} formData={value} onChange={handleChange} />;
  }

  return Wrapper;
};

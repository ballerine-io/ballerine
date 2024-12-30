import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElement } from '@/domains/collection-flow';
import get from 'lodash/get';
import set from 'lodash/set';
import { useEffect, useRef } from 'react';
import { injectIndexToDestinationIfNeeded } from '../../hocs/withDynamicUIInput';

export const useClearValueOnHide = (definition: UIElement, inputIndex: number | null) => {
  const { payload, stateApi } = useStateManagerContext();
  const { hidden } = useUIElementProps(definition, inputIndex);

  const ref = useRef({
    payload,
    setContext: stateApi.setContext,
  });

  useEffect(() => {
    ref.current.setContext = stateApi.setContext;
    ref.current.payload = payload;
  }, [stateApi.setContext, payload]);

  useEffect(() => {
    if (!definition.clearValueOnHide) return;

    const destination = definition.clearValueOnHide.valueDestination || definition.valueDestination;

    if (!destination) return;

    const formattedDestination = injectIndexToDestinationIfNeeded(destination, inputIndex);

    if (hidden && get(ref.current.payload, formattedDestination)) {
      set(ref.current.payload, formattedDestination, undefined);
      ref.current.setContext(ref.current.payload);

      console.log('Removed value of hidden element', formattedDestination, ref.current.payload);
    }
  }, [hidden, ref, definition.valueDestination, definition.clearValueOnHide, inputIndex]);
};

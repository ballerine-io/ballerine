import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
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

    // Removing by id and valueDestination
    if (definition.clearValueOnHide.byId && definition.clearValueOnHide.valueDestination) {
      const id = definition.clearValueOnHide.byId;
      const destination = definition.clearValueOnHide.valueDestination;

      const formattedDestination = injectIndexToDestinationIfNeeded(destination, inputIndex);

      const items = get(ref.current.payload, formattedDestination) as AnyObject[];

      const filteredItems = items?.filter(item => item.id !== id);

      if (hidden && get(ref.current.payload, formattedDestination)) {
        set(ref.current.payload, formattedDestination, filteredItems);
        ref.current.setContext(ref.current.payload);

        console.log(
          `Removed value of hidden element by id: ${id} from ${formattedDestination}`,
          ref.current.payload,
        );
      }

      return;
    }

    // Removing by valueDestination
    if (definition.clearValueOnHide.valueDestination) {
      const destination = definition.clearValueOnHide.valueDestination;

      const formattedDestination = injectIndexToDestinationIfNeeded(destination, inputIndex);

      if (hidden && get(ref.current.payload, formattedDestination)) {
        set(ref.current.payload, formattedDestination, undefined);
        ref.current.setContext(ref.current.payload);

        console.log('Removed value of hidden element', formattedDestination, ref.current.payload);
      }

      return;
    }
  }, [hidden, ref, definition.valueDestination, definition.clearValueOnHide, inputIndex]);
};

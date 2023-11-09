import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { useRefValue } from '@app/hooks/useRefValue';
import { useCallback } from 'react';

export interface DisablableListElementDefinition {
  elementName: string;
  atIndex: number;
}

const generateListElementId = (elementName: string, index: number): string =>
  `${elementName}[${index}]`;

export const useListElementsDisablerLogic = (definitions: DisablableListElementDefinition[]) => {
  const { state, helpers } = useDynamicUIContext();
  const { overrideState } = helpers;
  const stateRef = useRefValue(state);
  const overrideStateRef = useRefValue(overrideState);

  const disableElements = useCallback(() => {
    const uiState = stateRef.current;

    const nextState = {
      ...uiState,
      elements: {
        ...uiState.elements,
        ...definitions.reduce((states, definition) => {
          const elementName = generateListElementId(definition.elementName, definition.atIndex);

          const elementState = uiState.elements[elementName];

          states[elementName] = {
            ...elementState,
            isDisabled: true,
          };

          return states;
        }, {} as UIState['elements']),
      },
    };
    overrideStateRef.current(nextState);
  }, [overrideStateRef, stateRef, definitions]);

  const enableElements = useCallback(() => {
    const uiState = stateRef.current;

    const nextState = {
      ...uiState,
      elements: {
        ...uiState.elements,
        ...definitions.reduce((states, definition) => {
          const elementName = generateListElementId(definition.elementName, definition.atIndex);

          const elementState = uiState.elements[elementName];

          states[elementName] = {
            ...elementState,
            isDisabled: false,
          };

          return states;
        }, {} as UIState['elements']),
      },
    };

    overrideStateRef.current(nextState);
  }, [overrideStateRef, stateRef, definitions]);

  return {
    disableElements,
    enableElements,
  };
};

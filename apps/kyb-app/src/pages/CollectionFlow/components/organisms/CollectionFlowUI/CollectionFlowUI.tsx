import './validator';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { DynamicFormV2, IFormElement } from '@ballerine/ui';
import { FunctionComponent, useCallback } from 'react';
import { usePluginsHandler } from './hooks/usePluginsHandler/usePluginsHandler';
import { formElementsExtends } from './ui-elemenets.extends';

interface ICollectionFlowUIProps<TValues = CollectionFlowContext> {
  elements: Array<IFormElement<any, any>>;
  context: TValues;
}

const validationParams = {
  validateOnBlur: true,
  abortEarly: true,
};

export const CollectionFlowUI: FunctionComponent<ICollectionFlowUIProps> = ({
  elements,
  context,
}) => {
  const { stateApi } = useStateManagerContext();
  const { handleEvent } = usePluginsHandler();

  const handleChange = useCallback(
    (values: CollectionFlowContext) => {
      stateApi.setContext(values);
    },
    [stateApi],
  );

  return (
    <DynamicFormV2<CollectionFlowContext>
      fieldExtends={formElementsExtends}
      elements={elements}
      values={context}
      onChange={handleChange}
      onEvent={handleEvent}
      onSubmit={() => handleEvent('onSubmit')}
      validationParams={validationParams}
    />
  );
};

import './validator';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { DynamicFormV2, IFormElement } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { useAppMetadata } from './hooks/useAppMetadata';
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
  const appMetadata = useAppMetadata();

  const metadata = useMemo(
    () => ({
      app: appMetadata,
    }),
    [appMetadata],
  );

  const handleChange = useCallback(
    (values: CollectionFlowContext) => {
      stateApi.setContext(values);
    },
    [stateApi],
  );

  const handleSubmit = useCallback(() => {
    handleEvent('onSubmit');
  }, [handleEvent]);

  return (
    <DynamicFormV2<CollectionFlowContext>
      fieldExtends={formElementsExtends}
      elements={elements}
      values={context}
      onChange={handleChange}
      onEvent={handleEvent}
      onSubmit={handleSubmit}
      validationParams={validationParams}
      metadata={metadata}
    />
  );
};

import './validator';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { DynamicFormV2, IFormElement, IFormRef } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { usePluginsSubscribe } from './components/utility/PluginsRunner';
import { usePlugins } from './components/utility/PluginsRunner/hooks/external/usePlugins';
import { TPluginListener } from './components/utility/PluginsRunner/hooks/internal/usePluginsRunner/usePluginListeners';
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
  const { pluginStatuses } = usePlugins();

  const formRef = useRef<IFormRef>(null);
  const handlePluginExecution: TPluginListener = useCallback(
    (result, _, __, status) => {
      if (status === 'completed') {
        console.log({ _RESULT: result });
        formRef.current?.setValues(structuredClone(result) as object);
      }
    },
    [formRef],
  );

  usePluginsSubscribe(handlePluginExecution);

  const metadata = useMemo(
    () => ({
      _app: appMetadata,
      _plugins: pluginStatuses,
    }),
    [appMetadata, pluginStatuses],
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

  console.log('context', context);
  console.log(metadata);

  return (
    <DynamicFormV2
      fieldExtends={formElementsExtends}
      elements={elements}
      values={context as CollectionFlowContext}
      onChange={handleChange as (newValues: object) => void}
      onEvent={handleEvent}
      onSubmit={handleSubmit}
      validationParams={validationParams}
      metadata={metadata}
      ref={formRef}
    />
  );
};

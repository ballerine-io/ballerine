import './validator';

import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { DynamicFormV2, IFormElement, IFormRef } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { usePluginsSubscribe } from './components/utility/PluginsRunner';
import { usePlugins } from './components/utility/PluginsRunner/hooks/external/usePlugins';
import { TPluginListener } from './components/utility/PluginsRunner/hooks/internal/usePluginsRunner/usePluginListeners';
import { useAppMetadata } from './hooks/useAppMetadata';
import { useAppSync } from './hooks/useAppSync';
import { usePluginsHandler } from './hooks/usePluginsHandler/usePluginsHandler';
import { usePriorityFields } from './hooks/usePriorityFields';
import { formElementsExtends } from './ui-elemenets.extends';

interface ICollectionFlowUIProps<TValues = CollectionFlowContext> {
  elements: Array<IFormElement<any, any>>;
  context: TValues;
  isRevision?: boolean;
}

const validationParams = {
  validateOnBlur: true,
  abortEarly: true,
  validationDelay: 200,
};

export const CollectionFlowUI: FunctionComponent<ICollectionFlowUIProps> = ({
  elements,
  context,
  isRevision,
}) => {
  const { stateApi } = useStateManagerContext();
  const { helpers } = useDynamicUIContext();
  const { handleEvent } = usePluginsHandler();
  const { isSyncing, sync } = useAppSync();
  const appMetadata = useAppMetadata();
  const { pluginStatuses } = usePlugins();
  const priorityFields = usePriorityFields(elements, context, !isRevision);

  const formRef = useRef<IFormRef>(null);
  const handlePluginExecution: TPluginListener = useCallback(
    (result, _, __, status) => {
      if (status === 'completed') {
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
      _appState: {
        isSyncing,
      },
    }),
    [appMetadata, pluginStatuses, isSyncing],
  );

  const handleChange = useCallback(
    (values: CollectionFlowContext) => {
      stateApi.setContext(values);
    },
    [stateApi],
  );

  const handleSubmit = useCallback(
    async (values: CollectionFlowContext) => {
      helpers.setLoading(true);
      await sync(values);
      stateApi.setContext(values);
      handleEvent('onSubmit');
      helpers.setLoading(false);
    },
    [handleEvent, sync, helpers, stateApi],
  );

  return (
    <DynamicFormV2
      fieldExtends={formElementsExtends}
      elements={elements}
      values={context as CollectionFlowContext}
      onChange={handleChange as (newValues: object) => void}
      onEvent={handleEvent}
      onSubmit={handleSubmit as (values: object) => void}
      priorityFields={priorityFields}
      validationParams={validationParams}
      metadata={metadata}
      ref={formRef}
    />
  );
};

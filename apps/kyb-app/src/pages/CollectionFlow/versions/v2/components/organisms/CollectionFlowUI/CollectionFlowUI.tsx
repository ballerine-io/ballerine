import './validator';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { DynamicFormV2, IDynamicFormValidationParams, IFormElement, IFormRef } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { usePluginsSubscribe } from './components/utility/PluginsRunner';
import { usePlugins } from './components/utility/PluginsRunner/hooks/external/usePlugins';
import { TPluginListener } from './components/utility/PluginsRunner/hooks/internal/usePluginsRunner/usePluginListeners';
import { useAppMetadata } from './hooks/useAppMetadata';
import { useAppSync } from './hooks/useAppSync';
import { useFinalSubmission } from './hooks/useFinalSubmission/useFinalSubmission';
import { usePluginsHandler } from './hooks/usePluginsHandler/usePluginsHandler';
import { usePriorityFields } from './hooks/usePriorityFields';
import { formElementsExtends } from './ui-elemenets.extends';

interface ICollectionFlowUIProps<TValues = CollectionFlowContext> {
  elements: Array<IFormElement<any, any>>;
  context: TValues;
  isRevision?: boolean;
}

const validationParams: IDynamicFormValidationParams = {
  validateOnChange: true,
  validateOnBlur: true,
  abortEarly: false,
  abortAfterFirstError: true,
  validationDelay: 300,
};

export const CollectionFlowUI: FunctionComponent<ICollectionFlowUIProps> = ({
  elements,
  context,
  isRevision,
}) => {
  const { stateApi, state } = useStateManagerContext();
  const { handleEvent } = usePluginsHandler();
  const { isSyncing, sync, syncStateless, setIsSyncing } = useAppSync();
  const appMetadata = useAppMetadata();
  const { pluginStatuses } = usePlugins();
  const priorityFields = usePriorityFields(elements, context, !isRevision);
  const { isFinalSubmissionAvailable, handleFinalSubmission } = useFinalSubmission(context, state);

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
      await sync(values);
      stateApi.setContext(values);

      if (isFinalSubmissionAvailable) {
        try {
          setIsSyncing(true);
          await syncStateless(values);
          await handleFinalSubmission();
        } catch (error) {
          toast.error('Failed to submit form.');
          console.error(error);
        } finally {
          setIsSyncing(false);
        }
      } else {
        await sync(values);
      }

      handleEvent('onSubmit');
    },
    [
      handleEvent,
      sync,
      syncStateless,
      stateApi,
      isFinalSubmissionAvailable,
      handleFinalSubmission,
      setIsSyncing,
    ],
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

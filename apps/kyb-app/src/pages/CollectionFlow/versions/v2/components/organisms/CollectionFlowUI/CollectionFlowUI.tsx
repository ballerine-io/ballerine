import './validator';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  updateCollectionFlowStep,
} from '@ballerine/common';
import { DynamicFormV2, IDynamicFormValidationParams, IFormRef } from '@ballerine/ui';
import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { RevisionBlock } from './components/shared/RevisionBlock';
import { usePluginsSubscribe } from './components/utility/PluginsRunner';
import { usePlugins } from './components/utility/PluginsRunner/hooks/external/usePlugins';
import { TPluginListener } from './components/utility/PluginsRunner/hooks/internal/usePluginsRunner/usePluginListeners';
import { useAppMetadata } from './hooks/useAppMetadata';
import { useAppSync } from './hooks/useAppSync';
import { useFinalSubmission } from './hooks/useFinalSubmission/useFinalSubmission';
import { usePluginsHandler } from './hooks/usePluginsHandler/usePluginsHandler';
import { useRevisionFields } from './hooks/useRevisionFields';
import { formElementsExtends } from './ui-elemenets.extends';
import { useGlobalUIState } from '../../providers/GlobalUIState';

interface ICollectionFlowUIProps<TValues = CollectionFlowContext> {
  page: UIPage<'v2'>;
  pages: Array<UIPage<'v2'>>;
  context: TValues;
  metadata: UISchema['metadata'];
}

const DEFAULT_VALIDATION_PARAMS: IDynamicFormValidationParams = {
  validateOnChange: true,
  validateOnBlur: true,
  abortEarly: false,
  abortAfterFirstError: true,
  validationDelay: 300,
};

export const CollectionFlowUI: FunctionComponent<ICollectionFlowUIProps> = ({
  context,
  page,
  pages,
  metadata: _uiSchemaMetadata,
}) => {
  const { stateApi, state } = useStateManagerContext();
  const { updateUIState, state: uiState } = useGlobalUIState();
  const { handleEvent } = usePluginsHandler();
  const { sync, syncStateless, setIsSyncing } = useAppSync();
  const appMetadata = useAppMetadata();
  const { pluginStatuses } = usePlugins();
  const revisionFields = useRevisionFields(pages, context);
  const { isFinalSubmissionAvailable, isFinalSubmitted, handleFinalSubmission } =
    useFinalSubmission(context, state);
  const validationParams: IDynamicFormValidationParams = useMemo(
    () => ({ ...DEFAULT_VALIDATION_PARAMS, globalValidationRules: page.globalValidate }),
    [page.globalValidate],
  );

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
        isSyncing: uiState.isSyncing,
        isFinalSubmitted: uiState.isFinalSubmitted,
      },
      $page: getCollectionFlowState(context)?.steps?.find(step => step.stepName === page.stateName),
      ..._uiSchemaMetadata,
    }),
    [
      appMetadata,
      pluginStatuses,
      uiState.isSyncing,
      uiState.isFinalSubmitted,
      _uiSchemaMetadata,
      page,
      context,
    ],
  );

  useEffect(() => {
    const currentStep = getCollectionFlowState(context)?.steps?.find(
      step => step.stepName === page.stateName,
    );

    if (currentStep?.state === CollectionFlowStepStatesEnum.idle) {
      updateCollectionFlowStep(context, page.stateName, {
        state: CollectionFlowStepStatesEnum.inProgress,
      });

      stateApi.setContext(context);
    }
  }, [page, context, stateApi]);

  useEffect(() => {
    if (isFinalSubmitted) {
      updateUIState({ isFinalSubmitted });
    }
  }, [isFinalSubmitted, updateUIState]);

  const handleChange = useCallback(
    (values: CollectionFlowContext) => {
      stateApi.setContext(values);
    },
    [stateApi],
  );

  const handleSubmit = useCallback(
    async (values: CollectionFlowContext) => {
      const steps = getCollectionFlowState(context)?.steps;

      if (isFinalSubmissionAvailable) {
        try {
          setIsSyncing(true);

          const collectionFlowState = getCollectionFlowState(values);

          // Completing all steps on last step before submission
          if (collectionFlowState) {
            collectionFlowState.steps = steps?.map(step => ({
              ...step,
              state: CollectionFlowStepStatesEnum.completed,
            }));
          }

          stateApi.setContext(values);

          await syncStateless(values);
          await handleFinalSubmission();
        } catch (error) {
          toast.error('Failed to submit form.');
          console.error(error);
        } finally {
          setIsSyncing(false);
        }
      } else {
        const currentStep = getCollectionFlowState(context)?.steps?.find(
          step => step.stepName === page.stateName,
        );
        const state = currentStep?.state;

        if (!state) {
          toast.error('Collection flow state property, cannot continue. Please contact support.');
          throw new Error('Collection flow state property is missing in the context.');
        }

        // Transition to revised to avoid user visit same revision step again after revision
        if (state === CollectionFlowStepStatesEnum.revision) {
          updateCollectionFlowStep(values, page.stateName, {
            state: CollectionFlowStepStatesEnum.revised,
          });
        }

        // Completing step after submission
        if (
          [CollectionFlowStepStatesEnum.inProgress, CollectionFlowStepStatesEnum.edit].includes(
            state,
          )
        ) {
          updateCollectionFlowStep(values, page.stateName, {
            state: CollectionFlowStepStatesEnum.completed,
          });
        }

        stateApi.setContext(values);

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
      page,
      context,
    ],
  );

  return (
    <div className="flex flex-col gap-4">
      <RevisionBlock page={page} context={context} />
      <DynamicFormV2
        fieldExtends={formElementsExtends}
        elements={page.elements}
        values={context as CollectionFlowContext}
        onChange={handleChange as (newValues: object) => void}
        onEvent={handleEvent}
        onSubmit={handleSubmit as (values: object) => void}
        priorityFields={revisionFields}
        validationParams={validationParams}
        metadata={metadata}
        ref={formRef}
      />
    </div>
  );
};

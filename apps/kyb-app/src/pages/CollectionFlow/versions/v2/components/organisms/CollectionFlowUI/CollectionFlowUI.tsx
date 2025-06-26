import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/hooks/useStateManagerContext';
import { finalSubmissionRequest, UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  updateCollectionFlowStep,
} from '@ballerine/common';
import { DynamicFormV2, IDynamicFormValidationParams, IFormRef } from '@ballerine/ui';
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalUIState } from '../../providers/GlobalUIState';
import { RevisionBlock } from './components/shared/RevisionBlock';
import { usePluginsSubscribe } from './components/utility/PluginsRunner';
import { usePlugins } from './components/utility/PluginsRunner/hooks/external/usePlugins';
import { TPluginListener } from './components/utility/PluginsRunner/hooks/internal/usePluginsRunner/usePluginListeners';
import { useAppMetadata } from './hooks/useAppMetadata';
import { useAppSync } from './hooks/useAppSync';
import { usePluginsHandler } from './hooks/usePluginsHandler/usePluginsHandler';
import { useRevisionFields } from './hooks/useRevisionFields';
import { formElementsExtends } from './ui-elemenets.extends';
import { useCommonHttpParams } from './hooks/useCommonHttpParams/useCommonHttpParams';
import { getNextRevisionOrEditStep } from './helpers/get-next-not-completed-step';
import { getNextStep } from './helpers/get-next-step';
import { getCurrentStep } from './helpers/get-current-step';
import { useRedirectUrls } from '@/hooks/useRedirectUrls';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { CollectionFlowEvents } from '@/hooks/useFlowTracking/enums';
import { completePreviousSteps } from './helpers/complete-previous-steps';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { stateApi, state } = useStateManagerContext();
  const { state: uiState } = useGlobalUIState();
  const { trackEvent } = useFlowTracking();
  const redirectUrls = useRedirectUrls();
  const { handleEvent } = usePluginsHandler();
  const { sync, syncStateless, setIsSyncing } = useAppSync();
  const appMetadata = useAppMetadata();
  const commonHttpParams = useCommonHttpParams();
  const { pluginStatuses } = usePlugins();
  const { revisionFields, isLoadingRevisionFields } = useRevisionFields(pages, context);
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
      },
      $page: getCollectionFlowState(context)?.steps?.find(step => step.stepName === page.stateName),
      ..._uiSchemaMetadata,
    }),
    [appMetadata, pluginStatuses, uiState.isSyncing, _uiSchemaMetadata, page, context],
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

  const handleChange = useCallback(
    (values: CollectionFlowContext) => {
      stateApi.setContext(values);
    },
    [stateApi],
  );

  const handleSubmit = useCallback(
    async (values: CollectionFlowContext) => {
      try {
        setIsSubmitting(true);
        const collectionFlowStatus = getCollectionFlowState(values)?.status;
        let steps = getCollectionFlowState(values)?.steps;

        const isEditOrRevision =
          collectionFlowStatus === CollectionFlowStatusesEnum.edit ||
          collectionFlowStatus === CollectionFlowStatusesEnum.revision;
        const currentStep = getCurrentStep(steps || [], page.stateName);

        steps = completePreviousSteps(steps || [], page.stateName);

        const nextStep = isEditOrRevision
          ? getNextRevisionOrEditStep(steps || [], page.stateName)
          : getNextStep(steps || [], page.stateName);

        currentStep.state = CollectionFlowStepStatesEnum.completed;

        stateApi.setContext(values);

        await sync(values);

        if (!nextStep) {
          await finalSubmissionRequest(values);
          stateApi.setCollectionFlowState('completed');
        } else {
          stateApi.setCollectionFlowState(nextStep?.stepName);
        }

        if (!redirectUrls?.success) {
          setIsSubmitting(false);
        } else {
          location.href = redirectUrls.success;

          console.info(`Redirecting to success url: ${redirectUrls.success}`);
        }

        trackEvent(CollectionFlowEvents.FLOW_COMPLETED);
      } catch (error) {
        trackEvent(CollectionFlowEvents.FLOW_FAILED);
        toast.error('Failed to submit form.');
        console.error(error);

        if (redirectUrls?.failure) {
          location.href = redirectUrls.failure;

          console.info(`Redirecting to failure url: ${redirectUrls.failure}`);

          return;
        }

        setIsSubmitting(false);
      }
    },
    [
      handleEvent,
      sync,
      syncStateless,
      stateApi,
      setIsSyncing,
      page,
      context,
      redirectUrls,
      trackEvent,
    ],
  );

  if (isLoadingRevisionFields) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

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
        disabled={uiState.isSyncing || isSubmitting}
        priorityFields={revisionFields}
        validationParams={validationParams}
        metadata={metadata}
        ref={formRef}
        httpParams={commonHttpParams}
      />
    </div>
  );
};

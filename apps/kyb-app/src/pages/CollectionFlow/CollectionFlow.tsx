import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { AppErrorScreen } from '@/common/components/molecules/AppErrorScreen';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { useDependencies } from '@/common/providers/DependenciesProvider';
import { useTheme } from '@/common/providers/ThemeProvider';
import { AppShell } from '@/components/layouts/AppShell';
import { PoweredByLogo } from '@/components/molecules/PoweredByLogo';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import {
  PageError,
  usePageErrors,
} from '@/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { Cell } from '@/components/organisms/UIRenderer/elements/Cell';
import { Divider } from '@/components/organisms/UIRenderer/elements/Divider';
import { JSONForm } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { SubmitButton } from '@/components/organisms/UIRenderer/elements/SubmitButton';
import { Title } from '@/components/organisms/UIRenderer/elements/Title';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { prepareInitialUIState } from '@/helpers/prepareInitialUIState';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { LoadingScreen } from '@/pages/CollectionFlow/components/atoms/LoadingScreen';
import { Approved } from '@/pages/CollectionFlow/components/pages/Approved';
import { CompletedScreen } from '@/pages/CollectionFlow/components/pages/CompletedScreen';
import { Rejected } from '@/pages/CollectionFlow/components/pages/Rejected';
import {
  CollectionFlowStatusesEnum,
  getCollectionFlowState,
  setCollectionFlowStatus,
  setStepCompletionState,
} from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedUIRenderer } from './components/organisms/AnimatedUIRenderer';
import { FailedScreen } from './components/pages/FailedScreen';
import { useAdditionalWorkflowContext } from './hooks/useAdditionalWorkflowContext';

const elems = {
  h1: Title,
  h3: (props: AnyObject) => <h3 className="pt-4 text-xl font-bold">{props?.options?.text}</h3>,
  h4: (props: AnyObject) => <h4 className="pb-3 text-base font-bold">{props?.options?.text}</h4>,
  description: (props: AnyObject) => (
    <p
      className="font-inter pb-2 text-sm text-slate-500"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(props.options.descriptionRaw) as string,
      }}
    ></p>
  ),
  'json-form': JSONForm,
  container: Cell,
  mainContainer: Cell,
  'submit-button': SubmitButton,
  stepper: StepperUI,
  divider: Divider,
};

const isCompleted = (state: string) => state === 'completed' || state === 'finish';
const isFailed = (state: string) => state === 'failed';

const getRevisionStateName = (pageErrors: PageError[]) => {
  return pageErrors?.filter(pageError => !!pageError.errors.length)?.[0]?.stateName;
};

export const CollectionFlow = () => {
  const { language } = useLanguageParam();
  const { isLoading } = useDependencies();
  const { data: schema } = useUISchemasQuery({ language });
  const { data: collectionFlowData } = useFlowContextQuery();
  const { customer } = useCustomerQuery();
  const { t } = useTranslation();
  const { themeDefinition } = useTheme();
  const additionalContext = useAdditionalWorkflowContext();

  const elements = schema?.uiSchema?.elements;
  const definition = schema?.definition.definition;

  const pageErrors = usePageErrors(
    collectionFlowData?.context ?? ({} as CollectionFlowContext),
    elements || [],
  );
  const isRevision = useMemo(
    () =>
      getCollectionFlowState(collectionFlowData || {})?.status ===
      CollectionFlowStatusesEnum.revision,
    [collectionFlowData],
  );

  const initialContext: CollectionFlowContext = useMemo(() => {
    const contextCopy = { ...collectionFlowData?.context };
    const collectionFlow = getCollectionFlowState(contextCopy);

    if (isRevision && collectionFlow) {
      const revisionStateName = getRevisionStateName(pageErrors);
      collectionFlow.currentStep = revisionStateName || collectionFlow.currentStep;
      revisionStateName || collectionFlow.currentStep;
    }

    return contextCopy as CollectionFlowContext;
  }, [isRevision, pageErrors]);

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(
      elements || [],
      (collectionFlowData?.context as CollectionFlowContext) || {},
      isRevision,
    );
  }, [elements, collectionFlowData, isRevision]);

  // Breadcrumbs now using scrollIntoView method to make sure that breadcrumb is always in viewport.
  // Due to dynamic dimensions of logo it doesnt work well if scroll happens before logo is loaded.
  // This workaround is needed to wait for logo to be loaded so scrollIntoView will work with correct dimensions of page.
  const [isLogoLoaded, setLogoLoaded] = useState(customer?.logoImageUri ? false : true);

  useEffect(() => {
    if (!customer?.logoImageUri) return;

    // Resseting loaded state in case of logo change
    setLogoLoaded(false);
  }, [customer?.logoImageUri]);

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.approved)
    return <Approved />;

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.rejected)
    return <Rejected />;

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.completed)
    return <CompletedScreen />;

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.failed)
    return <FailedScreen />;

  if (isLoading) return <LoadingScreen />;

  // Edge case, normally should never happen
  if (!schema || !collectionFlowData) {
    console.error('Schema is missing.');

    return (
      <AppErrorScreen
        title="An unexpected error occurred. Please try again later."
        description="Please contact support if the issue persists."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DynamicUI initialState={initialUIState}>
        <DynamicUI.StateManager
          initialContext={initialContext}
          workflowId="1"
          definitionType={schema?.definition.definitionType}
          extensions={schema?.definition.extensions}
          definition={definition as State}
          config={collectionFlowData?.config}
        >
          {({ state, stateApi }) => {
            return (
              <DynamicUI.TransitionListener
                pages={elements ?? []}
                onNext={async (tools, prevState, currentState) => {
                  tools.setElementCompleted(prevState, true);

                  const context = stateApi.getContext();

                  const collectionFlow = getCollectionFlowState(context);

                  if (collectionFlow) {
                    const steps = collectionFlow?.steps || [];

                    const isAnyStepCompleted = steps.some(step => step.isCompleted);

                    setStepCompletionState(context, {
                      stepName: prevState,
                      completed: true,
                    });

                    collectionFlow.currentStep = currentState;

                    if (!isAnyStepCompleted) {
                      console.log('Collection flow touched, changing state to inprogress');
                      setCollectionFlowStatus(context, CollectionFlowStatusesEnum.inprogress);
                    }

                    stateApi.setContext(context);

                    await stateApi.invokePlugin('sync_workflow_runtime');
                  }
                }}
                onPrevious={async (tools, prevState, currentState) => {
                  tools.setElementCompleted(prevState, false);

                  const context = stateApi.getContext();

                  const collectionFlow = getCollectionFlowState(context);

                  if (collectionFlow) {
                    collectionFlow.currentStep = currentState;
                    stateApi.setContext(context);

                    await stateApi.invokePlugin('sync_workflow_runtime');
                  }
                }}
              >
                {() => {
                  // Temp state, has to be resolved to success or failure by plugins
                  if (state === 'done') return <LoadingScreen />;

                  if (isCompleted(state)) return <CompletedScreen />;

                  if (isFailed(state)) return <FailedScreen />;

                  return (
                    <DynamicUI.PageResolver state={state} pages={elements ?? []}>
                      {({ currentPage }) => {
                        return currentPage ? (
                          <DynamicUI.Page page={currentPage}>
                            <DynamicUI.ActionsHandler
                              actions={currentPage.actions}
                              stateApi={stateApi}
                            >
                              <AppShell>
                                <AppShell.Sidebar>
                                  <AnimatePresence mode="wait" initial={true}>
                                    <motion.div
                                      className="flex h-full flex-col"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.25 }}
                                    >
                                      <motion.div
                                        className="flex h-full flex-1 flex-col"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.25, delay: 0.2 }}
                                      >
                                        <motion.div
                                          className="flex flex-col gap-8 pb-10"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.25 }}
                                        >
                                          <div className="flex justify-start">
                                            <AppShell.LanguagePicker />
                                          </div>
                                          <AppShell.Navigation />
                                        </motion.div>
                                        <motion.div
                                          className="pb-10"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.25, delay: 0.3 }}
                                        >
                                          {customer?.logoImageUri && (
                                            <AppShell.Logo
                                              logoSrc={
                                                themeDefinition?.logo || customer?.logoImageUri
                                              }
                                              appName={customer?.displayName}
                                              onLoad={() => setLogoLoaded(true)}
                                            />
                                          )}
                                        </motion.div>
                                        <motion.div
                                          className="min-h-0 flex-1 pb-10"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.25, delay: 0.5 }}
                                        >
                                          {isLogoLoaded ? <StepperUI /> : null}
                                        </motion.div>
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.25, delay: 0.6 }}
                                        >
                                          {customer?.displayName && (
                                            <div>
                                              {
                                                t('contact', {
                                                  companyName: customer.displayName,
                                                }) as string
                                              }
                                            </div>
                                          )}
                                          {themeDefinition?.ui?.poweredBy !== false && (
                                            <div className="flex flex-col">
                                              <div className="border-b pb-12" />
                                              <PoweredByLogo
                                                className="mt-8"
                                                sidebarRootId="sidebar"
                                              />
                                            </div>
                                          )}
                                        </motion.div>
                                      </motion.div>
                                    </motion.div>
                                  </AnimatePresence>
                                </AppShell.Sidebar>
                                <AppShell.Content>
                                  <AppShell.FormContainer>
                                    {localStorage.getItem('devmode') ? (
                                      <div className="flex flex-col gap-4">
                                        DEBUG
                                        <div>
                                          {currentPage
                                            ? currentPage.stateName
                                            : 'Page not found and state ' + state}
                                        </div>
                                        <div className="flex gap-4">
                                          <button onClick={() => stateApi.sendEvent('PREVIOUS')}>
                                            prev
                                          </button>
                                          <button onClick={() => stateApi.sendEvent('NEXT')}>
                                            next
                                          </button>
                                        </div>
                                      </div>
                                    ) : null}
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-3 pb-3">
                                        <StepperProgress
                                          currentStep={
                                            (elements?.findIndex(
                                              page => page?.stateName === state,
                                            ) ?? 0) + 1
                                          }
                                          totalSteps={elements?.length ?? 0}
                                        />
                                        <ProgressBar />
                                      </div>
                                      <AnimatePresence mode="wait" initial={true}>
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.25, delay: 0.35 }}
                                        >
                                          <AnimatedUIRenderer
                                            elements={elems}
                                            currentPage={currentPage}
                                            schema={currentPage.elements}
                                          />
                                        </motion.div>
                                      </AnimatePresence>
                                    </div>
                                  </AppShell.FormContainer>
                                </AppShell.Content>
                              </AppShell>
                            </DynamicUI.ActionsHandler>
                          </DynamicUI.Page>
                        ) : null;
                      }}
                    </DynamicUI.PageResolver>
                  );
                }}
              </DynamicUI.TransitionListener>
            );
          }}
        </DynamicUI.StateManager>
      </DynamicUI>
    </motion.div>
  );
};

import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { useTheme } from '@/common/providers/ThemeProvider';
import { AppShell } from '@/components/layouts/AppShell';
import { PoweredByLogo } from '@/components/molecules/PoweredByLogo';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import {
  PageError,
  usePageErrors,
} from '@/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { UIRenderer } from '@/components/organisms/UIRenderer';
import { Cell } from '@/components/organisms/UIRenderer/elements/Cell';
import { Divider } from '@/components/organisms/UIRenderer/elements/Divider';
import { JSONForm } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { SubmitButton } from '@/components/organisms/UIRenderer/elements/SubmitButton';
import { Title } from '@/components/organisms/UIRenderer/elements/Title';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { UIElementV1, UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { prepareInitialUIState } from '@/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  setCollectionFlowStatus,
  setStepState,
} from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import { LoadingScreen } from './components/atoms/LoadingScreen';
import { Approved } from './components/pages/Approved';
import { CompletedScreen } from './components/pages/CompletedScreen';
import { FailedScreen } from './components/pages/FailedScreen';
import { Rejected } from './components/pages/Rejected';
import { useAdditionalWorkflowContext } from './hooks/useAdditionalWorkflowContext';
import { GlobalUIState } from '../v2/components/providers/GlobalUIState';

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
  return pageErrors
    ?.filter(pageError => !!pageError.errors.length)
    ?.map(pageError => pageError.stateName);
};

export const CollectionFlowV1 = withSessionProtected(() => {
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { data: collectionFlowData } = useFlowContextQuery();
  const { customer } = useCustomer();
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
      getCollectionFlowState(collectionFlowData?.context || {})?.status ===
      CollectionFlowStatusesEnum.revision,
    [collectionFlowData],
  );

  const revisionStateNames = useMemo(() => getRevisionStateName(pageErrors), [pageErrors]);

  const initialContext: CollectionFlowContext = useMemo(() => {
    const contextCopy = { ...collectionFlowData?.context };
    const collectionFlow = getCollectionFlowState(contextCopy);

    if (isRevision && collectionFlow) {
      collectionFlow.currentStep = revisionStateNames[0] || collectionFlow.currentStep;
    }

    return contextCopy as CollectionFlowContext;
  }, [isRevision, revisionStateNames, collectionFlowData?.context]);

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(
      elements as unknown as Array<UIPage<'v1'>>,
      (collectionFlowData?.context as CollectionFlowContext) || {},
      isRevision,
    );
  }, [elements, collectionFlowData, isRevision]);

  // Breadcrumbs now using scrollIntoView method to make sure that breadcrumb is always in viewport.
  // Due to dynamic dimensions of logo it doesnt work well if scroll happens before logo is loaded.
  // This workaround is needed to wait for logo to be loaded so scrollIntoView will work with correct dimensions of page.
  const [isLogoLoaded, setLogoLoaded] = useState(customer?.logoImageUri ? false : true);

  useEffect(() => {
    if (!customer?.logoImageUri) {
      return;
    }

    // Resseting loaded state in case of logo change
    setLogoLoaded(false);
  }, [customer?.logoImageUri]);

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.approved) {
    return <Approved />;
  }

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.rejected) {
    return <Rejected />;
  }

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.completed) {
    return <CompletedScreen />;
  }

  if (getCollectionFlowState(initialContext)?.status === CollectionFlowStatusesEnum.failed) {
    return <FailedScreen />;
  }

  return definition && collectionFlowData ? (
    <GlobalUIState>
      <DynamicUI initialState={initialUIState}>
        <DynamicUI.StateManager
          initialContext={initialContext}
          workflowId="1"
          definitionType={schema?.definition.definitionType}
          extensions={schema?.definition.extensions}
          definition={definition as State}
          config={collectionFlowData?.config}
          additionalContext={additionalContext}
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

                    setStepState(context, {
                      stepName: prevState,
                      state: CollectionFlowStepStatesEnum.completed,
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
              >
                {() => {
                  // Temp state, has to be resolved to success or failure by plugins
                  if (state === 'done') {
                    return <LoadingScreen />;
                  }

                  if (isCompleted(state)) {
                    return <CompletedScreen />;
                  }

                  if (isFailed(state)) {
                    return <FailedScreen />;
                  }

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
                                  <div className="flex h-full flex-col">
                                    <div className="flex h-full flex-1 flex-col">
                                      <div className="flex justify-between gap-8 pb-10">
                                        <AppShell.Navigation />
                                        {schema?.uiOptions?.disableLanguageSelection ? null : (
                                          <div className="flex w-full justify-end">
                                            <AppShell.LanguagePicker />
                                          </div>
                                        )}
                                      </div>
                                      <div className="pb-10">
                                        {customer?.logoImageUri && (
                                          <AppShell.Logo
                                            // @ts-ignore
                                            logoSrc={themeDefinition.logo || customer?.logoImageUri}
                                            // @ts-ignore
                                            appName={customer?.displayName}
                                            onLoad={() => setLogoLoaded(true)}
                                          />
                                        )}
                                      </div>
                                      <div className="min-h-0 flex-1 pb-10">
                                        {isLogoLoaded ? <StepperUI /> : null}
                                      </div>
                                      <div>
                                        {customer?.displayName && (
                                          <div>
                                            {
                                              t('contact', {
                                                companyName: customer.displayName,
                                              }) as string
                                            }
                                          </div>
                                        )}
                                        {themeDefinition.ui?.poweredBy !== false && (
                                          <div className="flex flex-col">
                                            <div className="border-b pb-12" />
                                            <PoweredByLogo
                                              className="mt-8 max-w-[10rem]"
                                              sidebarRootId="sidebar"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </AppShell.Sidebar>
                                <AppShell.Content>
                                  <AppShell.FormContainer>
                                    {localStorage.getItem('devmode') ? (
                                      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <div className="mb-4 flex items-center gap-2">
                                          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                                          <span
                                            className="cursor-help font-medium text-amber-900 hover:underline"
                                            data-tooltip-id="debug-mode-tooltip"
                                            data-tooltip-content="In debug mode you can navigate between steps without validation. Be aware that if required data is missing, plugins may fail when processing data at the end of the flow."
                                          >
                                            Debug Mode Active
                                          </span>
                                        </div>

                                        <div className="mb-3 text-sm text-amber-800">
                                          Current State:{' '}
                                          {currentPage ? (
                                            <span className="font-medium">
                                              {currentPage.stateName}
                                            </span>
                                          ) : (
                                            <span className="italic">
                                              Page not found - state: {state}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex gap-3">
                                          <button
                                            onClick={() => stateApi.sendEvent('PREVIOUS')}
                                            className="rounded bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200"
                                          >
                                            Previous
                                          </button>
                                          <button
                                            onClick={() => stateApi.sendEvent('NEXT')}
                                            className="rounded bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200"
                                          >
                                            Next
                                          </button>
                                          <button
                                            onClick={() => {
                                              try {
                                                const filledPayload = { ...stateApi.getContext() };

                                                const allElements: Array<{
                                                  valueDestination?: string;
                                                  placeholder?: string;
                                                }> = [];

                                                const findElementsWithPlaceholders = (
                                                  elements: any[],
                                                ) => {
                                                  if (!elements || !Array.isArray(elements)) {
                                                    return;
                                                  }

                                                  elements.forEach((element: any) => {
                                                    const isHidden =
                                                      element?.hidden === true ||
                                                      element?.options?.hidden === true ||
                                                      element?.visibleOn === false;

                                                    let isVisible = true;

                                                    if (
                                                      element?.visibleOn &&
                                                      Array.isArray(element.visibleOn)
                                                    ) {
                                                      isVisible = false;
                                                    }

                                                    if (
                                                      !isHidden &&
                                                      isVisible &&
                                                      element?.valueDestination
                                                    ) {
                                                      const placeholder =
                                                        element?.options?.uiSchema?.[
                                                          'ui:placeholder'
                                                        ] || element?.options?.hint;

                                                      if (placeholder) {
                                                        allElements.push({
                                                          valueDestination:
                                                            element.valueDestination,
                                                          placeholder,
                                                        });
                                                      }
                                                    }

                                                    const hasVisibilityConditions =
                                                      element?.visibleOn &&
                                                      Array.isArray(element.visibleOn);

                                                    if (
                                                      element?.type === 'json-form' &&
                                                      hasVisibilityConditions
                                                    ) {
                                                      const visibilityRules = element.visibleOn;

                                                      return;
                                                    }

                                                    if (
                                                      element?.elements &&
                                                      Array.isArray(element.elements)
                                                    ) {
                                                      findElementsWithPlaceholders(
                                                        element.elements,
                                                      );
                                                    }

                                                    if (
                                                      element?.schema &&
                                                      Array.isArray(element.schema)
                                                    ) {
                                                      findElementsWithPlaceholders(element.schema);
                                                    }

                                                    if (
                                                      element?.children &&
                                                      Array.isArray(element.children)
                                                    ) {
                                                      findElementsWithPlaceholders(
                                                        element.children,
                                                      );
                                                    }
                                                  });
                                                };

                                                if (currentPage?.elements) {
                                                  findElementsWithPlaceholders(
                                                    currentPage.elements,
                                                  );
                                                }

                                                allElements.forEach(
                                                  ({ valueDestination, placeholder }) => {
                                                    if (!valueDestination || !placeholder) {
                                                      return;
                                                    }

                                                    const path = valueDestination.split('.');

                                                    let current: any = filledPayload;

                                                    for (let i = 0; i < path.length - 1; i++) {
                                                      const key = path[i];

                                                      if (!key) {
                                                        continue;
                                                      }

                                                      if (!current[key]) {
                                                        current[key] = {};
                                                      }

                                                      current = current[key];
                                                    }

                                                    const lastKey = path[path.length - 1];

                                                    if (lastKey) {
                                                      if (
                                                        lastKey.toLowerCase().includes('date') ||
                                                        valueDestination
                                                          .toLowerCase()
                                                          .includes('date')
                                                      ) {
                                                        current[lastKey] = '11/11/1990';
                                                      } else {
                                                        current[lastKey] = placeholder;
                                                      }
                                                    }
                                                  },
                                                );

                                                stateApi.setContext(filledPayload);
                                              } catch (error) {
                                                console.error('Error filling placeholders:', error);
                                              }
                                            }}
                                            className="rounded bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200"
                                          >
                                            Fill Placeholders
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
                                      <div>
                                        <UIRenderer
                                          elements={elems}
                                          schema={currentPage.elements as Array<UIElementV1<any>>}
                                        />
                                      </div>
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
    </GlobalUIState>
  ) : (
    <LoadingScreen />
  );
});

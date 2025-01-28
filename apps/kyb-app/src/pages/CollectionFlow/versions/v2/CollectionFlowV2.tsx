import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { useTheme } from '@/common/providers/ThemeProvider';
import { AppShell } from '@/components/layouts/AppShell';
import { PoweredByLogo } from '@/components/molecules/PoweredByLogo';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { prepareInitialUIState } from '@/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { CollectionFlowStatusesEnum, getCollectionFlowState } from '@ballerine/common';
import { IFormElement } from '@ballerine/ui';
import { LoadingScreen } from '../v1/components/atoms/LoadingScreen';
import { Approved } from '../v1/components/pages/Approved';
import { CompletedScreen } from '../v1/components/pages/CompletedScreen';
import { FailedScreen } from '../v1/components/pages/FailedScreen';
import { Rejected } from '../v1/components/pages/Rejected';
import { useAdditionalWorkflowContext } from '../v1/hooks/useAdditionalWorkflowContext';
import { CollectionFlowUI } from './components/organisms/CollectionFlowUI';
import { PluginsRunner } from './components/organisms/CollectionFlowUI/components/utility/PluginsRunner';
import { useRevisionStates } from './hooks/useRevisionStates';

const isCompleted = (state: string) => state === 'completed' || state === 'finish';
const isFailed = (state: string) => state === 'failed';

export const CollectionFlowV2 = withSessionProtected(() => {
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { data: collectionFlowData } = useFlowContextQuery();
  const { customer } = useCustomer();
  const { t } = useTranslation();
  const { themeDefinition } = useTheme();
  const additionalContext = useAdditionalWorkflowContext();

  const elements = schema?.uiSchema?.elements as unknown as Array<UIPage<'v2'>>;
  const definition = schema?.definition.definition;

  const { initialRevisionState, revisionStateNames } = useRevisionStates(
    elements || [],
    collectionFlowData?.context ?? ({} as CollectionFlowContext),
  );

  const isRevision = useMemo(
    () =>
      getCollectionFlowState(collectionFlowData?.context)?.status ===
      CollectionFlowStatusesEnum.revision,
    [collectionFlowData],
  );

  const initialContext: CollectionFlowContext = useMemo(() => {
    const contextCopy = { ...collectionFlowData?.context };
    const collectionFlow = getCollectionFlowState(contextCopy);

    if (isRevision && collectionFlow) {
      collectionFlow.currentStep = initialRevisionState || collectionFlow.currentStep;
    }

    return contextCopy as CollectionFlowContext;
  }, [isRevision, collectionFlowData?.context, initialRevisionState]);

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(
      elements || [],
      (initialContext as CollectionFlowContext) || {},
      isRevision,
    );
  }, [elements, isRevision, initialContext]);

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

  return definition && collectionFlowData ? (
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
        {({ state, stateApi, payload }) => {
          return (
            <DynamicUI.TransitionListener
              pages={elements as unknown as Array<UIPage<'v1'>>}
              onNext={async (tools, prevState) => {
                tools.setElementCompleted(prevState, true);
              }}
            >
              {() => {
                // Temp state, has to be resolved to success or failure by plugins
                if (state === 'done') return <LoadingScreen />;

                if (isCompleted(state)) return <CompletedScreen />;

                if (isFailed(state)) return <FailedScreen />;

                return (
                  <DynamicUI.PageResolver
                    state={state}
                    pages={elements as unknown as Array<UIPage<'v1'>>}
                  >
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
                                      <div className="flex w-full justify-end">
                                        <AppShell.LanguagePicker />
                                      </div>
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
                                      {isLogoLoaded ? (
                                        <StepperUI revisionStateNames={revisionStateNames} />
                                      ) : null}
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
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-3 pb-3">
                                      <StepperProgress
                                        currentStep={
                                          (elements?.findIndex(page => page?.stateName === state) ??
                                            0) + 1
                                        }
                                        totalSteps={elements?.length ?? 0}
                                      />
                                      <ProgressBar />
                                    </div>
                                    <div>
                                      <PluginsRunner plugins={currentPage.plugins || []}>
                                        <CollectionFlowUI
                                          elements={
                                            currentPage.elements as unknown as Array<
                                              IFormElement<any, any>
                                            >
                                          }
                                          context={payload}
                                          isRevision={isRevision}
                                        />
                                      </PluginsRunner>
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
  ) : (
    <LoadingScreen />
  );
});

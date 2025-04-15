import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { useTheme } from '@/common/providers/ThemeProvider';
import { AppShell } from '@/components/layouts/AppShell';
import { PoweredByLogo } from '@/components/molecules/PoweredByLogo';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { CollectionFlowStatusesEnum, getCollectionFlowState } from '@ballerine/common';
import { LoadingScreen } from '../v1/components/atoms/LoadingScreen';
import { Approved } from '../v1/components/pages/Approved';
import { CompletedScreen } from '../v1/components/pages/CompletedScreen';
import { FailedScreen } from '../v1/components/pages/FailedScreen';
import { Rejected } from '../v1/components/pages/Rejected';
import { useAdditionalWorkflowContext } from '../v1/hooks/useAdditionalWorkflowContext';
import { CollectionFlowUI } from './components/organisms/CollectionFlowUI';
import { PluginsRunner } from './components/organisms/CollectionFlowUI/components/utility/PluginsRunner';
import { useCollectionFlowContext } from './hooks/useCollectionFlowContext/useCollectionFlowContext';
import { GlobalUIState } from './components/providers/GlobalUIState';
import { useSuccessRedirectUrl } from './hooks/useSuccessRedirectUrl';
import { useFailureRedirectUrl } from './hooks/useFailureRedirectUrl';

const isCompleted = (state: string) => state === 'completed' || state === 'finish';
const isFailed = (state: string) => state === 'failed';

export const CollectionFlowV2 = withSessionProtected(() => {
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { data: collectionFlowData } = useFlowContextQuery();
  const collectionFlowContext = useCollectionFlowContext(
    collectionFlowData?.context as CollectionFlowContext,
    schema as UISchema,
  );
  const { customer } = useCustomer();
  const { t } = useTranslation();
  const { themeDefinition } = useTheme();
  const additionalContext = useAdditionalWorkflowContext();
  const successRedirectUrl = useSuccessRedirectUrl(collectionFlowData?.config);
  const failureRedirectUrl = useFailureRedirectUrl(collectionFlowData?.config);

  const elements = schema?.uiSchema?.elements as unknown as Array<UIPage<'v2'>>;
  const definition = schema?.definition.definition;

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

  if (
    getCollectionFlowState(collectionFlowData?.context)?.status ===
    CollectionFlowStatusesEnum.approved
  ) {
    return <Approved />;
  }

  if (
    getCollectionFlowState(collectionFlowData?.context)?.status ===
    CollectionFlowStatusesEnum.rejected
  ) {
    return <Rejected />;
  }

  if (
    getCollectionFlowState(collectionFlowData?.context)?.status ===
    CollectionFlowStatusesEnum.completed
  ) {
    return <CompletedScreen redirectUrl={successRedirectUrl} />;
  }

  if (
    getCollectionFlowState(collectionFlowData?.context)?.status ===
    CollectionFlowStatusesEnum.failed
  ) {
    return <FailedScreen redirectUrl={failureRedirectUrl} />;
  }

  return definition && collectionFlowContext ? (
    <GlobalUIState>
      <DynamicUI>
        <DynamicUI.StateManager
          initialContext={collectionFlowContext as CollectionFlowContext}
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
                                        {themeDefinition.settings?.contactInformation ? (
                                          <div
                                            className="text-sm"
                                            dangerouslySetInnerHTML={{
                                              __html: themeDefinition.settings?.contactInformation,
                                            }}
                                          />
                                        ) : customer?.displayName ? (
                                          <div>
                                            {themeDefinition.ui?.contactUsText ? (
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: themeDefinition.ui?.contactUsText,
                                                }}
                                              />
                                            ) : (
                                              (t('contact', {
                                                companyName: customer.displayName,
                                              }) as string)
                                            )}
                                          </div>
                                        ) : null}
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
                                                      let value = placeholder;

                                                      if (
                                                        lastKey.toLowerCase().includes('date') ||
                                                        lastKey.toLowerCase().includes('birth') ||
                                                        valueDestination
                                                          .toLowerCase()
                                                          .includes('date') ||
                                                        valueDestination
                                                          .toLowerCase()
                                                          .includes('birth')
                                                      ) {
                                                        value = '11/11/1990';
                                                      }

                                                      current[lastKey] = value;
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
                                        <PluginsRunner plugins={currentPage.plugins || []}>
                                          <CollectionFlowUI
                                            page={currentPage as unknown as UIPage<'v2'>}
                                            pages={elements as unknown as Array<UIPage<'v2'>>}
                                            context={payload}
                                            metadata={schema?.metadata}
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
    </GlobalUIState>
  ) : (
    <LoadingScreen />
  );
});

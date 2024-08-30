import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { AppShell } from '@/components/layouts/AppShell';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import { usePageErrors } from '@/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { Validator } from '@/components/providers/Validator';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { prepareInitialUIState } from '@/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { Approved } from '@/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@/pages/CollectionFlow/components/pages/Rejected';
import { Success } from '@/pages/CollectionFlow/components/pages/Success';
import { transformV1UIElementsToV2UIElements } from '@/pages/CollectionFlowV2/helpers';
import { rendererSchema } from '@/pages/CollectionFlowV2/renderer-schema';
import { Renderer } from '@ballerine/ui';
import set from 'lodash/set';

// TODO: Find a way to make this work via the workflow-browser-sdk `subscribe` method.
export const useCompleteLastStep = () => {
  const { stateApi, state } = useStateManagerContext();
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { refetch } = useFlowContextQuery();
  const elements = schema?.uiSchema?.elements;
  const isPendingSync = useRef(false);

  useEffect(() => {
    (async () => {
      if (state !== 'finish') return;

      const { data: context } = await refetch();

      if (
        !context ||
        context?.flowConfig?.stepsProgress?.[elements?.at(-1)?.stateName ?? '']?.isCompleted ||
        isPendingSync.current
      ) {
        return;
      }

      set(context, `flowConfig.stepsProgress.${elements?.at(-1)?.stateName}.isCompleted`, true);
      await stateApi.invokePlugin('sync_workflow_runtime');
      isPendingSync.current = true;
    })();
  }, [elements, refetch, state, stateApi]);
};

export const CollectionFlowV2 = withSessionProtected(() => {
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { data: context } = useFlowContextQuery();
  const { customer } = useCustomer();
  const { t } = useTranslation();

  const elements = schema?.uiSchema?.elements;
  const definition = schema?.definition.definition;

  const pageErrors = usePageErrors(context ?? {}, elements || []);
  const isRevision = useMemo(
    () => pageErrors.some(error => error.errors?.some(error => error.type === 'warning')),
    [pageErrors],
  );

  const filteredNonEmptyErrors = pageErrors?.filter(pageError => !!pageError.errors.length);

  // @ts-ignore
  const initialContext: CollectionFlowContext | null = useMemo(() => {
    const appState =
      filteredNonEmptyErrors?.[0]?.stateName ||
      context?.flowConfig?.appState ||
      elements?.at(0)?.stateName;
    if (!appState) return null;

    return {
      ...context,
      flowConfig: {
        ...context?.flowConfig,
        appState,
      },
      state: appState,
    };
  }, [context, elements, filteredNonEmptyErrors]);

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(elements || [], context || {}, isRevision);
  }, [elements, context, isRevision]);

  // Breadcrumbs now using scrollIntoView method to make sure that breadcrumb is always in viewport.
  // Due to dynamic dimensions of logo it doesnt work well if scroll happens before logo is loaded.
  // This workaround is needed to wait for logo to be loaded so scrollIntoView will work with correct dimensions of page.
  const [isLogoLoaded, setLogoLoaded] = useState(customer?.logoImageUri ? false : true);

  useEffect(() => {
    if (!customer?.logoImageUri) return;

    // Resseting loaded state in case of logo change
    setLogoLoaded(false);
  }, [customer?.logoImageUri]);

  if (initialContext?.flowConfig?.appState === 'approved') return <Approved />;
  if (initialContext?.flowConfig?.appState == 'rejected') return <Rejected />;

  return definition && context ? (
    <DynamicUI initialState={initialUIState}>
      <DynamicUI.StateManager
        initialContext={initialContext}
        workflowId="1"
        definitionType={schema?.definition.definitionType}
        extensions={schema?.definition.extensions}
        definition={definition as State}
      >
        {({ state, stateApi, payload }) =>
          state === 'finish' ? (
            <Success />
          ) : (
            <DynamicUI.PageResolver state={state} pages={elements ?? []}>
              {({ currentPage }) => {
                return currentPage ? (
                  <Validator
                    elements={transformV1UIElementsToV2UIElements(currentPage.elements)}
                    context={payload}
                  >
                    <DynamicUI.Page page={currentPage}>
                      <DynamicUI.TransitionListener
                        onNext={async (tools, prevState) => {
                          tools.setElementCompleted(prevState, true);

                          set(
                            stateApi.getContext(),
                            `flowConfig.stepsProgress.${prevState}.isCompleted`,
                            true,
                          );
                          await stateApi.invokePlugin('sync_workflow_runtime');
                        }}
                      >
                        <DynamicUI.ActionsHandler actions={currentPage.actions} stateApi={stateApi}>
                          <AppShell>
                            <AppShell.Sidebar>
                              <div className="flex h-full flex-col">
                                <div className="flex h-full flex-1 flex-col">
                                  <div className="flex flex-row justify-between gap-2 whitespace-nowrap pb-10">
                                    <AppShell.Navigation />
                                    <div>
                                      <AppShell.LanguagePicker />
                                    </div>
                                  </div>
                                  <div className="pb-10">
                                    {customer?.logoImageUri && (
                                      <AppShell.Logo
                                        // @ts-ignore
                                        logoSrc={customer?.logoImageUri}
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
                                      <div className="border-b pb-12">
                                        {
                                          t('contact', {
                                            companyName: customer.displayName,
                                          }) as string
                                        }
                                      </div>
                                    )}
                                    <img src={'/poweredby.svg'} className="mt-6" />
                                  </div>
                                </div>
                              </div>
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
                                        (elements?.findIndex(page => page?.stateName === state) ??
                                          0) + 1
                                      }
                                      totalSteps={elements?.length ?? 0}
                                    />
                                    <ProgressBar />
                                  </div>
                                  <div>
                                    <Renderer
                                      elements={currentPage.elements}
                                      schema={rendererSchema}
                                    />
                                  </div>
                                </div>
                              </AppShell.FormContainer>
                            </AppShell.Content>
                          </AppShell>
                        </DynamicUI.ActionsHandler>
                      </DynamicUI.TransitionListener>
                    </DynamicUI.Page>
                  </Validator>
                ) : null;
              }}
            </DynamicUI.PageResolver>
          )
        }
      </DynamicUI.StateManager>
    </DynamicUI>
  ) : null;
});

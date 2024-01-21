import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { StepperProgress } from '@/common/components/atoms/StepperProgress';
import { ProgressBar } from '@/common/components/molecules/ProgressBar';
import { AppShell } from '@/components/layouts/AppShell';
import { DynamicUI, State } from '@/components/organisms/DynamicUI';
import { usePageErrors } from '@/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { UIRenderer } from '@/components/organisms/UIRenderer';
import { Cell } from '@/components/organisms/UIRenderer/elements/Cell';
import { Divider } from '@/components/organisms/UIRenderer/elements/Divider';
import { JSONForm } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { SubmitButton } from '@/components/organisms/UIRenderer/elements/SubmitButton';
import { Title } from '@/components/organisms/UIRenderer/elements/Title';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { prepareInitialUIState } from '@/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { Approved } from '@/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@/pages/CollectionFlow/components/pages/Rejected';
import { Success } from '@/pages/CollectionFlow/components/pages/Success';
import { AnyObject } from '@ballerine/ui';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import set from 'lodash/set';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';

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

export const CollectionFlow = withSessionProtected(() => {
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

  useCompleteLastStep();

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
        {({ state, stateApi }) =>
          state === 'finish' ? (
            <Success />
          ) : (
            <DynamicUI.PageResolver state={state} pages={elements ?? []}>
              {({ currentPage }) => {
                return currentPage ? (
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
                                <div className="flex flex-row justify-between pb-10">
                                  <AppShell.Navigation />
                                  <div className="w-[105px]">
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
                                    <button onClick={() => stateApi.sendEvent('NEXT')}>next</button>
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
                                  <UIRenderer elements={elems} schema={currentPage.elements} />
                                </div>
                              </div>
                            </AppShell.FormContainer>
                          </AppShell.Content>
                        </AppShell>
                      </DynamicUI.ActionsHandler>
                    </DynamicUI.TransitionListener>
                  </DynamicUI.Page>
                ) : null;
              }}
            </DynamicUI.PageResolver>
          )
        }
      </DynamicUI.StateManager>
    </DynamicUI>
  ) : null;
});

import { AppShell } from '@app/components/layouts/AppShell';
import { DynamicUI, State } from '@app/components/organisms/DynamicUI';
import { UIRenderer } from '@app/components/organisms/UIRenderer';
import { Cell } from '@app/components/organisms/UIRenderer/elements/Cell';
import { Divider } from '@app/components/organisms/UIRenderer/elements/Divider';
import { JSONForm } from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { withInitialDataCreation } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation';
import { StepperUI } from '@app/components/organisms/UIRenderer/elements/StepperUI';
import { Title } from '@app/components/organisms/UIRenderer/elements/Title';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { prepareInitialUIState } from '@app/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { Approved } from '@app/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@app/pages/CollectionFlow/components/pages/Rejected';
import { Success } from '@app/pages/CollectionFlow/components/pages/Success';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';
import { usePageErrors } from '@app/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { SubmitButton } from '@app/components/organisms/UIRenderer/elements/SubmitButton';
import { CollectionFlowContext } from '@app/domains/collection-flow/types/flow-context.types';
import { StepperProgress } from '@app/common/components/atoms/StepperProgress';
import { ProgressBar } from '@app/common/components/molecules/ProgressBar';

const elems = {
  h1: Title,
  h3: (props: AnyObject) => <h3 className="pb-3 text-xl font-bold">{props?.options?.text}</h3>,
  h4: (props: AnyObject) => <h4 className="pb-3 text-base font-bold">{props?.options?.text}</h4>,
  description: (props: AnyObject) => (
    <p
      className="font-inter pb-2 text-sm text-slate-500"
      dangerouslySetInnerHTML={{ __html: props.options.descriptionRaw as string }}
    ></p>
  ),
  'json-form': withInitialDataCreation(JSONForm),
  container: Cell,
  mainContainer: Cell,
  'submit-button': SubmitButton,
  stepper: StepperUI,
  divider: Divider,
};

export const CollectionFlowDumb = () => {
  const { data: schema } = useUISchemasQuery();
  const { data: context } = useFlowContextQuery();
  const { customer } = useCustomer();
  const elements = schema?.uiSchema?.elements;
  const definition = schema?.definition.definition;

  const pageErrors = usePageErrors(context ?? {}, elements);
  const filteredNonEmptyErrors = pageErrors?.filter(pageError => !!pageError.errors.length);
  const initialContext: CollectionFlowContext = useMemo(() => {
    const appState =
      filteredNonEmptyErrors?.[0]?.stateName ||
      context?.flowConfig?.appState ||
      elements?.at(0).stateName;
    if (!appState) return null;

    return {
      ...context,
      flowConfig: {
        ...context.flowConfig,
        appState,
      },
      state: appState,
    };
  }, []);

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(elements || [], context || {});
  }, [elements, context]);

  if (initialContext.flowConfig?.appState === 'approved') return <Approved />;
  if (initialContext.flowConfig?.appState == 'rejected') return <Rejected />;

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
            <DynamicUI.PageResolver state={state} pages={elements}>
              {({ currentPage }) => {
                return currentPage ? (
                  <DynamicUI.Page page={currentPage}>
                    <DynamicUI.TransitionListener
                      onNext={(tools, prevState) => {
                        tools.setElementCompleted(prevState, true);
                      }}
                    >
                      <DynamicUI.ActionsHandler actions={currentPage.actions} stateApi={stateApi}>
                        <AppShell>
                          <AppShell.Sidebar>
                            <div className="flex h-full flex-col">
                              <div className="flex-1">
                                <div className="pb-10">
                                  <AppShell.Navigation />
                                </div>
                                <div className="pb-10">
                                  <AppShell.Logo
                                    logoSrc={customer.logoImageUri}
                                    appName={customer.displayName}
                                  />
                                </div>
                                <div className="h-full max-h-[460px] pb-10">
                                  <StepperUI />
                                </div>
                              </div>
                              <div>
                                <div>
                                  <div className="border-b pb-12">
                                    Contact {customer.displayName || 'PayLynk'} for support <br />{' '}
                                    example@example.com (000) 123-4567
                                  </div>
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
                                      elements.findIndex(page => page.stateName === state) + 1
                                    }
                                    totalSteps={elements.length}
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
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);

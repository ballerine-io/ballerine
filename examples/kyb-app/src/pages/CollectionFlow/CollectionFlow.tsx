import { AppShell } from '@app/components/layouts/AppShell';
import { DynamicUI, State } from '@app/components/organisms/DynamicUI';
import { UIRenderer } from '@app/components/organisms/UIRenderer';
import { ButtonUIElement } from '@app/components/organisms/UIRenderer/elements/ButtonUI';
import { Cell } from '@app/components/organisms/UIRenderer/elements/Cell';
import { JSONForm } from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { StepperUI } from '@app/components/organisms/UIRenderer/elements/StepperUI';
import { Title } from '@app/components/organisms/UIRenderer/elements/Title';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { prepareInitialUIState } from '@app/helpers/prepareInitialUIState';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

const elems = {
  h1: Title,
  h3: (props: AnyObject) => <h3 className="font-bold">{props?.options?.text}</h3>,
  'json-form': JSONForm,
  container: Cell,
  mainContainer: Cell,
  'json-form:button': ButtonUIElement,
  stepper: StepperUI,
};

export const CollectionFlowDumb = () => {
  const { data: schema } = useUISchemasQuery();
  const { data: context } = useFlowContextQuery();
  const { customer } = useCustomer();
  const elements = schema?.uiSchema?.elements;
  const definition = schema?.definition.definition;

  const initialUIState = useMemo(() => {
    return prepareInitialUIState(elements || [], context?.context || {});
  }, [elements, context]);

  return definition && context?.context ? (
    <DynamicUI initialState={initialUIState}>
      <DynamicUI.StateManager
        initialContext={context.context}
        workflowId="1"
        definitionType={schema?.definition.definitionType}
        extensions={schema?.definition.extensions}
        definition={definition as State}
      >
        {({ state, stateApi }) => (
          <DynamicUI.PageResolver state={state} pages={elements}>
            {({ currentPage }) => {
              return currentPage ? (
                <DynamicUI.Page page={currentPage}>
                  <DynamicUI.TransitionListener
                    onNext={tools => {
                      tools.setElementCompleted(currentPage.stateName, true);
                    }}
                  >
                    <DynamicUI.ActionsHandler actions={currentPage.actions} stateApi={stateApi}>
                      <AppShell>
                        <AppShell.Sidebar>
                          <div className="flex flex-col h-full">
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
                            {/* <div className="flex flex-col gap-4">
                              DEBUG
                              <div>
                                {currentPage
                                  ? currentPage.stateName
                                  : 'Page not found and state ' + state}
                              </div>
                              <div className="flex gap-4">
                                <button onClick={() => stateApi.sendEvent('PREVIOUS')}>prev</button>
                                <button onClick={() => stateApi.sendEvent('NEXT')}>next</button>
                              </div>
                            </div> */}
                            <UIRenderer elements={elems} schema={currentPage.elements} />
                          </AppShell.FormContainer>
                        </AppShell.Content>
                      </AppShell>
                    </DynamicUI.ActionsHandler>
                  </DynamicUI.TransitionListener>
                </DynamicUI.Page>
              ) : null;
            }}
          </DynamicUI.PageResolver>
        )}
      </DynamicUI.StateManager>
    </DynamicUI>
  ) : null;
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);

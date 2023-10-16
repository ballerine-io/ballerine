import '@ballerine/ui/dist/style.css';
import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
// import { RouterProvider } from 'react-router-dom';
// import { router } from '@app/router';
// import { CustomerProvider } from '@app/components/providers/CustomerProvider';
// import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
// import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { DynamicUI } from '@app/components/organisms/DynamicUI';
import { State } from '@app/components/organisms/DynamicUI/StateManager/types';
import { UIRenderer } from '@app/components/organisms/UIRenderer';
import { Title } from '@app/components/organisms/UIRenderer/elements/Title';
import { Cell } from '@app/components/organisms/UIRenderer/elements/Cell';
import { ActionsHandler } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { ButtonUIElement } from '@app/components/organisms/UIRenderer/elements/ButtonUI';
import { JSONForm } from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { AnyObject } from '@ballerine/ui';
import { StepperUI } from '@app/components/organisms/UIRenderer/elements/StepperUI';
import { useMemo } from 'react';
import { prepareInitialUIState } from '@app/helpers/prepareInitialUIState';
import { CustomerProvider } from '@app/components/providers/CustomerProvider';
import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';

const elems = {
  h1: Title,
  h3: (props: AnyObject) => <h3 className="font-bold">{props?.options?.text}</h3>,
  'json-form': JSONForm,
  container: Cell,
  mainContainer: Cell,
  'json-form:button': ButtonUIElement,
  stepper: StepperUI,
};

export const App = () => {
  const dependancyQueries = [useCustomerQuery(), useUISchemasQuery(), useFlowContextQuery()];

  return (
    <AppLoadingContainer dependencies={dependancyQueries}>
      <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
        <RouterProvider router={router} />
      </CustomerProvider>
      {/* {definition && context?.context ? (
        <DynamicUI initialState={initialUIState}>
          <DynamicUI.StateManager
            initialContext={context.context}
            workflowId="1"
            definitionType={schema.data?.definition.definitionType}
            extensions={schema.data?.definition.extensions}
            definition={definition as State}
          >
            {({ state, stateApi }) => (
              <DynamicUI.PageResolver state={state} pages={elements}>
                {({ currentPage }) => {
                  return currentPage ? (
                    <DynamicUI.Page page={currentPage}>
                      <div className="flex flex-col gap-4">
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
                      </div>
                      <DynamicUI.TransitionListener
                        onNext={tools => {
                          tools.setElementCompleted(currentPage.stateName, true);
                        }}
                      >
                        <ActionsHandler actions={currentPage.actions} stateApi={stateApi}>
                          <UIRenderer elements={elems} schema={currentPage.elements} />
                        </ActionsHandler>
                      </DynamicUI.TransitionListener>
                    </DynamicUI.Page>
                  ) : null;
                }}
              </DynamicUI.PageResolver>
            )}
          </DynamicUI.StateManager>
        </DynamicUI>
      ) : null} */}
    </AppLoadingContainer>
  );
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};

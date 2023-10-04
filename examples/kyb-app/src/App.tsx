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

const elems = {
  h1: Title,
  'json-form': JSONForm,
  container: Cell,
  mainContainer: Cell,
  'json-form:button': ButtonUIElement,
};

export const App = () => {
  const dependancyQueries = [useCollectionFlowSchemaQuery(), useCustomerQuery()];
  const schema = useUISchemasQuery();
  const elements = schema.data?.uiSchema?.elements;
  const definition = schema.data?.definition.definition;

  return (
    <AppLoadingContainer dependencies={dependancyQueries}>
      {/* <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
        <RouterProvider router={router} />
      </CustomerProvider> */}
      {definition ? (
        <DynamicUI>
          <DynamicUI.StateManager
            workflowId="1"
            definitionType={schema.data?.definition.definitionType}
            extensions={schema.data?.definition.extensions}
            definition={definition as State}
          >
            {({ state, stateApi }) => (
              <DynamicUI.PageResolver state={state} pages={elements}>
                {({ currentPage }) => {
                  return currentPage ? (
                    <>
                      <ActionsHandler actions={currentPage.actions} stateApi={stateApi}>
                        <UIRenderer elements={elems} schema={currentPage.elements} />
                      </ActionsHandler>
                      <div className="flex flex-col gap-4">
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
                    </>
                  ) : null;
                }}
              </DynamicUI.PageResolver>
            )}
          </DynamicUI.StateManager>
        </DynamicUI>
      ) : null}
    </AppLoadingContainer>
  );
};

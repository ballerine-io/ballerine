import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { DynamicUIRenderer } from '@app/components/organisms/DynamicUIRenderer/DynamicUIRenderer';
import { ApiActionHandler } from '@app/components/organisms/DynamicUIRenderer/action-handlers/api.action-handler';
import { actions, definitions } from '@app/components/organisms/DynamicUIRenderer/temp';
import { ButtonUIElement } from '@app/components/organisms/DynamicUIRenderer/ui-elements/ButtonUI';
import { TextInputUIElement } from '@app/components/organisms/DynamicUIRenderer/ui-elements/TextInputUIElement';
import { UISchema } from '@app/domains/collection-flow';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import '@ballerine/ui/dist/style.css';
// import { RouterProvider } from 'react-router-dom';
// import { router } from '@app/router';
// import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
// import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
// import { CustomerProvider } from '@app/components/providers/CustomerProvider';
// import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
// import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
// import { useCustomerQuery } from '@app/hooks/useCustomerQuery';

const initialCtx = {};
const actionHandlers = [new ApiActionHandler()];
const elements = { button: ButtonUIElement, text: TextInputUIElement };

export const App = () => {
  // const dependancyQueries = [useCollectionFlowSchemaQuery(), useCustomerQuery()];
  const UISchemas = useUISchemasQuery();
  const { data } = UISchemas;
  const { uiSchema } = data || ({} as UISchema);

  // return (
  // <AppLoadingContainer dependencies={dependancyQueries}>
  //   <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
  //     <RouterProvider router={router} />
  //   </CustomerProvider>
  // </AppLoadingContainer>
  // );

  console.log('schema', uiSchema);

  return (
    <AppLoadingContainer dependencies={[UISchemas]}>
      <DynamicUIRenderer
        uiElements={uiSchema?.uiElements}
        actions={uiSchema?.actions}
        context={initialCtx}
        actionHandlers={actionHandlers}
        elements={elements}
      />
    </AppLoadingContainer>
  );
};

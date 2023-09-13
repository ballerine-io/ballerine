import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { ContextManager } from '@app/components/organisms/ContextManager';
import { DynamicElements } from '@app/components/organisms/DynamicElements/DynamicElements';
import { ApiActionHandler } from '@app/components/organisms/DynamicElements/action-handlers/api.action-handler';
import { ButtonUIElement } from '@app/components/organisms/DynamicElements/ui-elements/ButtonUI';
import { TextInputUIElement } from '@app/components/organisms/DynamicElements/ui-elements/TextInputUIElement';
import { UISchema } from '@app/domains/collection-flow';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { additionalPersonalInfo, controls, personalInformation } from '@app/schemas';
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

  return (
    <AppLoadingContainer dependencies={[UISchemas]}>
      <ContextManager
        context={initialCtx}
        uiSchemas={[controls, personalInformation, additionalPersonalInfo]}
      />
    </AppLoadingContainer>
  );
};

import { APP_LANGUAGE_QUERY_KEY } from '@/common/consts/consts';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { ValidatorPOC } from '@/ValidatorPOC';
import '@ballerine/ui/dist/style.css';

export const App = () => {
  // useLanguage uses react-router context
  // so it cannot be used here because this part is outside of Router context.
  const language = new URLSearchParams(window.location.search).get(APP_LANGUAGE_QUERY_KEY) || 'en';

  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(language),
    useFlowContextQuery(),
  ] as const;

  // return (
  //   <Sentry.ErrorBoundary>
  //     <AppLoadingContainer dependencies={dependancyQueries}>
  //       <CustomerProvider
  //         loadingPlaceholder={<LoadingScreen />}
  //         fallback={CustomerProviderFallback}
  //       >
  //         <RouterProvider router={router} />
  //       </CustomerProvider>
  //     </AppLoadingContainer>
  //   </Sentry.ErrorBoundary>
  // );

  return <ValidatorPOC />;
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};

import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { APP_LANGUAGE_QUERY_KEY } from '@/common/consts/consts';
import { CustomerProviderFallback } from '@/components/molecules/CustomerProviderFallback';
import { AppLoadingContainer } from '@/components/organisms/AppLoadingContainer';
import { CustomerProvider } from '@/components/providers/CustomerProvider';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { router } from '@/router';
import '@ballerine/ui/dist/style.css';
import * as Sentry from '@sentry/react';
import { RouterProvider } from 'react-router-dom';

export const App = () => {
  const language = new URLSearchParams(window.location.search).get(APP_LANGUAGE_QUERY_KEY) || 'en';

  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(language),
    useFlowContextQuery(),
  ] as const;

  return (
    <Sentry.ErrorBoundary>
      <AppLoadingContainer dependencies={dependancyQueries}>
        <CustomerProvider
          loadingPlaceholder={<LoadingScreen />}
          fallback={CustomerProviderFallback}
        >
          <RouterProvider router={router} />
        </CustomerProvider>
      </AppLoadingContainer>
    </Sentry.ErrorBoundary>
  );
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};

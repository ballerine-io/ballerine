import '@ballerine/ui/dist/style.css';
import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { CustomerProvider } from '@app/components/providers/CustomerProvider';
import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';

export const App = () => {
  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(),
    useFlowContextQuery(),
  ] as const;

  return (
    <AppLoadingContainer dependencies={dependancyQueries}>
      <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
        <RouterProvider router={router} />
      </CustomerProvider>
    </AppLoadingContainer>
  );
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};

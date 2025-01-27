import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@/components/molecules/CustomerProviderFallback';
import { CustomerProvider } from '@/components/providers/CustomerProvider';

export const withCustomer = <TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
) => {
  const Wrapper = (props: TComponentProps) => (
    <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
      <Component {...props} />
    </CustomerProvider>
  );

  return Wrapper;
};

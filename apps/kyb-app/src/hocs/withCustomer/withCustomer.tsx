import { CustomerProviderFallback } from '@/components/molecules/CustomerProviderFallback';
import { CustomerProvider } from '@/components/providers/CustomerProvider';
import { LoadingScreen } from '@/pages/CollectionFlow/components/atoms/LoadingScreen';

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

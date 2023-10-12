import { AppErrorScreen } from '@app/common/components/molecules/AppErrorScreen';
import { FallbackComponent } from '@app/components/providers/CustomerProvider';

export const CustomerProviderFallback: FallbackComponent = ({ errorMessage }) => {
  return (
    <AppErrorScreen
      title={`Failed to load application information.`}
      subtitle={'Please contact support@example.com.'}
    />
  );
};

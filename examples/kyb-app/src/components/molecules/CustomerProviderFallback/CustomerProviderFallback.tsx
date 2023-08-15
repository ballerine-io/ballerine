import { AppErrorScreen } from '@app/common/components/molecules/AppErrorScreen';
import { FallbackComponent } from '@app/components/providers/CustomerProvider';
import { Button } from '@ballerine/ui';

export const CustomerProviderFallback: FallbackComponent = ({ errorMessage }) => {
  return (
    <AppErrorScreen
      title={`Failed to load customer information.`}
      subtitle={errorMessage}
      actionButton={
        <Button variant="secondary" onClick={() => location.reload()}>
          Refresh page
        </Button>
      }
    />
  );
};

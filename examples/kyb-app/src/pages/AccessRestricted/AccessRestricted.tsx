import { AppErrorScreen } from '@app/common/components/molecules/AppErrorScreen';

export const AccessRestricted = () => {
  return (
    <AppErrorScreen
      title={`Access token is required to proceed.`}
      subtitle={'Contact support@example.com for more information'}
      actionButton={null}
    />
  );
};

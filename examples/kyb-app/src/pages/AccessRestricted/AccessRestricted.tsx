import { AppErrorScreen } from '@app/common/components/molecules/AppErrorScreen';

export const AccessRestricted = () => {
  return (
    <AppErrorScreen
      title={`Access token is required to proceed.`}
      description={
        <p className="text-muted-foreground opacity-70">
          Contact support@example.com for more information
        </p>
      }
      actionButton={null}
    />
  );
};

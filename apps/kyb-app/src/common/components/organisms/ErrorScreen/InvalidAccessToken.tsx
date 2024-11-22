import { AppErrorScreen } from '../../molecules/AppErrorScreen';

export const InvalidAccessTokenErrorScreen = () => {
  return (
    <AppErrorScreen
      title="Invalid Access Token"
      description={
        <div className="text-muted-foreground flex flex-col gap-1">
          <p>The access token provided is not valid or has expired.</p>
          <p>Please ensure you have a valid access token to continue.</p>
          <ul>
            <li>
              <b>1.</b> Verify that you are using the most recent URL provided to you
            </li>
            <li>
              <b>2.</b> Your access token may have expired - request a new one if needed
            </li>
            <li>
              <b>3.</b> If you continue having issues accessing the application, please contact
              support
            </li>
          </ul>
        </div>
      }
    />
  );
};

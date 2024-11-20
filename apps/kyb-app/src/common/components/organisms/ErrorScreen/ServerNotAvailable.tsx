import { AppErrorScreen } from '../../molecules/AppErrorScreen';

export const ServerNotAvailableErrorScreen = () => {
  return (
    <AppErrorScreen
      title="Server Not Available"
      description={
        <div className="!text-muted-foreground flex flex-col gap-1">
          <p>We are unable to connect to our servers at this time.</p>
          <p>This could be due to maintenance or temporary technical difficulties.</p>
          <ul>
            <li>
              <b>1.</b> Please wait a few minutes and try refreshing the page
            </li>
            <li>
              <b>2.</b> Check your internet connection
            </li>
            <li>
              <b>3.</b> If the problem persists, our servers may be undergoing maintenance. Please
              try again later or contact support
            </li>
          </ul>
        </div>
      }
    />
  );
};

import { AppErrorScreen } from '../../molecules/AppErrorScreen';

export const NetworkErrorScreen = () => {
  return (
    <AppErrorScreen
      title="Network Error"
      description={
        <div className="text-muted-foreground flex flex-col gap-1">
          <p>Oops! It looks like you are having trouble connecting to the network.</p>
          <ul>
            <li>
              <b>1.</b> Check your internet connection
            </li>
            <li>
              <b>2.</b> Try refreshing the page
            </li>
            <li>
              <b>3.</b> If the problem persists, please contact our support team
            </li>
          </ul>
        </div>
      }
    />
  );
};

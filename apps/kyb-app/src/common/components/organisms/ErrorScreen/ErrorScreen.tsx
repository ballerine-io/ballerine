import { AccessTokenIsMissingError } from '@/common/errors/access-token-is-missing';
import { InvalidAccessTokenError } from '@/common/errors/invalid-access-token';
import { useRouteError } from 'react-router-dom';
import { AppErrorScreen } from '../../molecules/AppErrorScreen';
import { InvalidAccessTokenErrorScreen } from './InvalidAccessToken';
import { MissingTokenErrorScreen } from './MissingTokenErrorScreen';
import { NetworkErrorScreen } from './NetworkErrorScreen';

export const ErrorScreen = () => {
  const error = useRouteError();

  if (error instanceof AccessTokenIsMissingError) {
    return <MissingTokenErrorScreen />;
  }

  if (error instanceof InvalidAccessTokenError) {
    return <InvalidAccessTokenErrorScreen />;
  }

  // Network error or server down
  if (error instanceof TypeError) {
    return <NetworkErrorScreen />;
  }

  return (
    <AppErrorScreen
      title="Something went wrong"
      description={
        <div className="text-muted-foreground flex flex-col gap-1">
          <p>We apologize, but something unexpected went wrong.</p>
          <p>Here are a few things you can try:</p>
          <ul>
            <li>
              <b>1.</b> Refresh the page and try again
            </li>
            <li>
              <b>2.</b> Clear your browser cache and cookies
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

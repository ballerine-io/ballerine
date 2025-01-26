import { AppErrorScreen } from '../../molecules/AppErrorScreen';

export const MissingTokenErrorScreen = () => {
  return (
    <AppErrorScreen
      title="Missing Access Token"
      description={
        <div className="!text-muted-foreground flex flex-col gap-1">
          <p>This application requires an access token to function.</p>
          <p>The token should be provided as a URL parameter but appears to be missing.</p>
          <ul>
            <li>
              <b>1.</b> Check that you are using the complete URL provided to you
            </li>
            <li>
              <b>2.</b> The URL should include "?token=" followed by your access token
            </li>
            <li>
              <b>3.</b> If you don't have an access token or are still having issues, please contact
              support
            </li>
          </ul>
        </div>
      }
    />
  );
};

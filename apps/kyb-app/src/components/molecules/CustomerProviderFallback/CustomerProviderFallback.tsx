import { AppErrorScreen } from '@/common/components/molecules/AppErrorScreen';
import { FallbackComponent } from '@/components/providers/CustomerProvider';
import { getAccessToken } from '@/helpers/get-access-token.helper';

export const CustomerProviderFallback: FallbackComponent = ({ statusCode }) => {
  const defaultExampleToken = import.meta.env.VITE_DEFAULT_EXAMPLE_TOKEN;
  const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME;

  if (!getAccessToken() && defaultExampleToken && environmentName === 'local') {
    window.location.replace(`/collection-flow/?token=${defaultExampleToken}`);

    return null;
  }

  if (statusCode === 401) {
    return (
      <AppErrorScreen
        title="Invalid token"
        description={
          <div className="text-muted-foreground flex flex-col gap-1 opacity-70">
            <p>The requested URL requires permissions.</p>
            <p>
              It seems that the token used in the URL you have entered <b>is</b> invalid.
            </p>
            <ul>
              <li>
                <b>1.</b> Please check that you have entered the correct URL.
              </li>
              <li>
                <b>2.</b> If you have entered the correct URL and still see the error, please
                contact support
              </li>
            </ul>
          </div>
        }
      />
    );
  }

  return (
    <AppErrorScreen
      title={`Failed to load application information.`}
      description={
        <p className="text-muted-foreground opacity-50">Please contact support@example.com.</p>
      }
    />
  );
};

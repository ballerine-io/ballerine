import { AppNavigate } from '@app/common/components/organisms/NavigateWithToken';
import { getAccessToken } from '@app/helpers/get-access-token.helper';
import { useMemo } from 'react';

export function withTokenProtected<TComponentProps>(
  Component: React.ComponentType<TComponentProps>,
) {
  function Wrapper(props: TComponentProps) {
    const accessToken = useMemo(() => getAccessToken(), []);

    if (!accessToken) return <AppNavigate to="restricted" />;

    return <Component {...props} />;
  }

  Wrapper.displayName = `withTokenProtected(${Component.displayName})`;

  return Wrapper;
}

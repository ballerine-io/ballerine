import { AppNavigate } from '@/common/components/organisms/NavigateWithToken';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useMemo } from 'react';

export function withTokenProtected<TComponentProps>(
  Component: React.ComponentType<TComponentProps>,
) {
  function Wrapper(props: TComponentProps) {
    const accessToken = useMemo(() => getAccessToken(), []);

    if (!accessToken) return <AppNavigate to="restricted" />;

    // @ts-ignore
    return <Component {...props} />;
  }

  Wrapper.displayName = `withTokenProtected(${Component.displayName})`;

  return Wrapper;
}

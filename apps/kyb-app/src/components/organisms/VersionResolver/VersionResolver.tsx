import { LoadingScreen } from '@/pages/CollectionFlow/components/atoms/LoadingScreen';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent, useEffect, useState } from 'react';

interface IVersionResolverProps {
  version: number;
  children: AnyChildren;
}

export const VersionResolver: FunctionComponent<IVersionResolverProps> = ({
  version,
  children,
}) => {
  const [isResolved, setResolved] = useState(false);

  useEffect(() => {
    if (!version) return;

    if (version === 1) {
      setResolved(true);
      return;
    }

    if (location.href.includes(`/v${version}/`)) {
      setResolved(true);
      return;
    }

    location.href = `${location.href.replace(location.origin, `/v${version}/collection-flow`)}`;
  }, [version]);

  return isResolved ? children : <LoadingScreen />;
};

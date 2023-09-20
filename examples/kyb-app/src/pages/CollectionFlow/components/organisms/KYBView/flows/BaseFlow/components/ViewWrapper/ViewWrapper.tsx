import { AppShell } from '@app/components/layouts/AppShell';
import { BackButton } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/BackButton';
import { AnyChildren } from '@ballerine/ui';
import { useOutlet } from 'react-router-dom';

interface Props {
  children: AnyChildren;
}

export const ViewWrapper = ({ children }: Props) => {
  const outlet = useOutlet();

  return <AppShell backButton={<BackButton />}>{outlet ? outlet : children}</AppShell>;
};

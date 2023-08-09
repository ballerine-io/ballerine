import { AppShell } from '@app/components/layouts/AppShell';
import { BackButton } from '@app/components/organisms/KYBView/components/BackButton';
import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const ViewWrapper = ({ children }: Props) => {
  return <AppShell backButton={<BackButton />}>{children}</AppShell>;
};

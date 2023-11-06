import { Content } from '@app/components/layouts/AppShell/Content';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';
import { Logo } from '@app/components/layouts/AppShell/Logo';
import { Navigation } from '@app/components/layouts/AppShell/Navigation';
import { Sidebar } from '@app/components/layouts/AppShell/Sidebar';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AppShell = ({ children }: Props) => {
  return <div className="w-ful flex h-screen flex-nowrap">{children}</div>;
};

AppShell.FormContainer = FormContainer;
AppShell.Sidebar = Sidebar;
AppShell.Content = Content;
AppShell.Logo = Logo;
AppShell.Navigation = Navigation;

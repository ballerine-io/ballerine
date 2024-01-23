import { Logo } from '@/components/layouts/AppShell/Logo';
import { Content } from '@/components/layouts/AppShell/Content';
import { Sidebar } from '@/components/layouts/AppShell/Sidebar';
import { Navigation } from '@/components/layouts/AppShell/Navigation';
import { FormContainer } from '@/components/layouts/AppShell/FormContainer';
import { LanguagePicker } from '@/components/layouts/AppShell/LanguagePicker';

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
AppShell.LanguagePicker = LanguagePicker;

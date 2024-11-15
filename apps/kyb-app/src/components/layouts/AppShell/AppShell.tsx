import { Content } from '@/components/layouts/AppShell/Content';
import { FormContainer } from '@/components/layouts/AppShell/FormContainer';
import { LanguagePicker } from '@/components/layouts/AppShell/LanguagePicker';
import { Logo } from '@/components/layouts/AppShell/Logo';
import { Navigation } from '@/components/layouts/AppShell/Navigation';
import { Sidebar } from '@/components/layouts/AppShell/Sidebar';
import { motion } from 'motion/react';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AppShell = ({ children }: Props) => {
  return (
    <motion.div className="w-full flex h-screen flex-nowrap overflow-y-hidden">
      {children}
    </motion.div>
  );
};

AppShell.FormContainer = FormContainer;
AppShell.Sidebar = Sidebar;
AppShell.Content = Content;
AppShell.Logo = Logo;
AppShell.Navigation = Navigation;
AppShell.LanguagePicker = LanguagePicker;

import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AppShell = ({ children }: Props) => {
  const settings = useSettings();

  return (
    <div className="w-ful flex h-screen flex-nowrap">
      <div className="bg-primary col-span-2 w-[20%] p-4">
        <img className="h-16 w-16" src={settings.logo} alt={settings.appName} />
      </div>
      <div className="col-span-8 h-full w-[80%] overflow-auto p-4">{children}</div>
    </div>
  );
};

AppShell.FormContainer = FormContainer;

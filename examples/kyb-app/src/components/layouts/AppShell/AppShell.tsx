import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AppShell = ({ children }: Props) => {
  const settings = useSettings();

  return (
    <div className="w-ful flex h-full flex-nowrap">
      <div className="bg-primary col-span-2 w-[20%] p-4">
        <img className="h-16 w-16" src={settings.logo} alt={settings.appName} />
      </div>
      <div className="col-span-8 w-[80%] p-4">{children}</div>
    </div>
  );
};

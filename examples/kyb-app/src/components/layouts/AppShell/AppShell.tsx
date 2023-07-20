import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';
import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  backButton?: AnyChildren;
  onBackButtonClick?: () => void;
}

export const AppShell = ({ children, backButton, onBackButtonClick }: Props) => {
  const settings = useSettings();

  return (
    <div className="w-ful flex h-screen flex-nowrap">
      <div className="bg-primary col-span-2 w-[24%] px-10 pt-14 pb-4">
        <div className="font-inter flex h-full flex-col">
          <div className="flex flex-1 flex-col pb-16">
            <div onClick={onBackButtonClick}>{backButton}</div>
            <div className="pt-24">
              <img src={settings.logo} alt={settings.appName} />
            </div>
            <div className="flex-1 pt-12">
              <h1 className="text-3xl font-bold">{settings.title}</h1>
              <h2 className="mt-6">{settings.subtitle}</h2>
            </div>
            <span dangerouslySetInnerHTML={{ __html: settings.contactInformation }}></span>
          </div>
          <div>
            <img src={'/poweredby.svg'} />
          </div>
        </div>
      </div>
      <div className="col-span-8 h-full w-[76%] overflow-auto bg-[#F2F5FF] p-4">{children}</div>
    </div>
  );
};

AppShell.FormContainer = FormContainer;

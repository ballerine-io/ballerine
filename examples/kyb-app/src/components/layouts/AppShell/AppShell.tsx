import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { Stepper } from '@app/components/atoms/Stepper';
import { Item } from '@app/components/atoms/Stepper/Item';
import { VerticalLayout } from '@app/components/atoms/Stepper/layouts/Vertical';
import { Content } from '@app/components/layouts/AppShell/Content';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';
import { Logo } from '@app/components/layouts/AppShell/Logo';
import { Navigation } from '@app/components/layouts/AppShell/Navigation';
import { Sidebar } from '@app/components/layouts/AppShell/Sidebar';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  backButton?: AnyChildren;
  isLoading?: boolean;
  onBackButtonClick?: () => void;
}

export const AppShell = ({ children, backButton, isLoading, onBackButtonClick }: Props) => {
  const settings = useSettings();
  const { steps, state } = useViewState();
  const { customer } = useCustomer();

  return (
    <div className="w-ful flex h-screen flex-nowrap">
      {/* <div className="font-inter flex h-full flex-col">
          <div className="flex flex-1 flex-col pb-16">
            <div onClick={onBackButtonClick}>{backButton}</div>
            <div className="pb-16 pt-24">
              <img
                src={customer.logoImageUri || settings.logo}
                alt={settings.appName}
                className="max-h-[80px] max-w-[200px] object-cover"
              />
            </div>
            <div className="h-full max-h-[440px]">
              {isLoading ? null : (
                <Stepper>
                  <VerticalLayout>
                    {steps.map(step => {
                      return step.hidden ? null : (
                        <Item
                          key={`step-${step.index}`}
                          active={state === step.dataAlias}
                          label={step.label}
                          status={step.meta?.status}
                        />
                      );
                    })}
                  </VerticalLayout>
                </Stepper>
              )}
            </div>
          </div>
          <div>
            <div className="border-b pb-12">
              Contact {customer.displayName || 'PayLynk'} for support <br /> example@example.com
              (000) 123-4567
            </div>
            <img src={'/poweredby.svg'} className="mt-6" />
          </div>
        </div>
      </div> */}
      {children}
    </div>
  );
};

AppShell.FormContainer = FormContainer;
AppShell.Sidebar = Sidebar;
AppShell.Content = Content;
AppShell.Logo = Logo;
AppShell.Navigation = Navigation;

import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { Stepper } from '@app/components/atoms/Stepper';
import { Item } from '@app/components/atoms/Stepper/Item';
import { VerticalLayout } from '@app/components/atoms/Stepper/layouts/Vertical';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';
import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  backButton?: AnyChildren;
  onBackButtonClick?: () => void;
}

export const AppShell = ({ children, backButton, onBackButtonClick }: Props) => {
  const settings = useSettings();
  const { steps, state, context } = useViewState();

  return (
    <div className="w-ful flex h-screen flex-nowrap">
      <div className="bg-primary col-span-2 w-[24%] px-10 pt-14 pb-4">
        <div className="font-inter flex h-full flex-col">
          <div className="flex flex-1 flex-col pb-16">
            <div onClick={onBackButtonClick}>{backButton}</div>
            <div className="pt-24 pb-16">
              <img src={settings.logo} alt={settings.appName} />
            </div>
            <div className="h-[236px]">
              <Stepper>
                <VerticalLayout>
                  {steps.map(step => {
                    return (
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
            </div>
          </div>
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: settings.contactInformation }}
              className="border-b pb-12"
            ></div>
            <img src={'/poweredby.svg'} className="mt-6" />
          </div>
        </div>
      </div>
      <div className="col-span-8 h-full w-[76%] overflow-auto bg-[#F2F5FF] p-4">{children}</div>
    </div>
  );
};

AppShell.FormContainer = FormContainer;

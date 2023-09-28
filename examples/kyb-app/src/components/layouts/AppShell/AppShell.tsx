import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { Stepper } from '@app/components/atoms/Stepper';
import {
  BreadcrumbActive,
  BreadcrumbItemInput,
} from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs';
import { Breadcrumbs } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/Breadcrumbs';
import { VerticalLayout } from '@app/components/atoms/Stepper/layouts/Vertical';
import { FormContainer } from '@app/components/layouts/AppShell/FormContainer';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { AnyChildren, ctw } from '@ballerine/ui';
import { useMemo } from 'react';

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

  const breadcrumbItems: BreadcrumbItemInput[] = useMemo(
    (): BreadcrumbItemInput[] =>
      steps.map(step => ({
        id: step.dataAlias,
        label: step.label,
        state: step?.meta?.status || 'idle',
      })),
    [steps],
  );

  const activeBreadcrumb: BreadcrumbActive | null = useMemo(() => {
    const activeItem = breadcrumbItems.find(item => item.id === state);
    if (!activeItem) return null;

    return {
      id: activeItem.id,
      state: activeItem.state,
    };
  }, [breadcrumbItems, state]);

  return (
    <div className="w-ful flex h-screen flex-nowrap">
      <div className="bg-primary col-span-2 w-[24%] max-w-[418px] px-14 pb-4 pt-14">
        <div className="font-inter flex h-full flex-col">
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
                  <Breadcrumbs items={breadcrumbItems} active={activeBreadcrumb}>
                    {(items, theme) => {
                      return (
                        <VerticalLayout>
                          {items.map(itemProps => {
                            return (
                              <div
                                className={ctw(
                                  'last:bg- flex flex-row items-center gap-4 first:bg-white',
                                )}
                                key={itemProps.id}
                              >
                                <Breadcrumbs.Item
                                  active={itemProps.active}
                                  state={itemProps.state}
                                  theme={theme}
                                />
                                <Breadcrumbs.Label
                                  active={itemProps.active}
                                  text={itemProps.label}
                                  state={itemProps.state}
                                />
                              </div>
                            );
                          })}
                        </VerticalLayout>
                      );
                    }}
                  </Breadcrumbs>
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
      </div>
      <div className="col-span-8 h-full w-[100%] overflow-auto bg-[#F2F5FF] p-4">{children}</div>
    </div>
  );
};

AppShell.FormContainer = FormContainer;

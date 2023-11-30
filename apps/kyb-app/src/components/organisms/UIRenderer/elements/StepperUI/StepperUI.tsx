import { Stepper } from '@/components/atoms/Stepper';
import { VerticalLayout } from '@/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useMemo, useRef } from 'react';
import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { UIPage } from '@/domains/collection-flow';
import { UIElementState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import {
  BreadcrumbItemInput,
  Breadcrumbs,
} from '@/components/atoms/Stepper/components/atoms/Breadcrumbs';
import clsx from 'clsx';

export const StepperUI = () => {
  const { state: uiState } = useDynamicUIContext();
  const { pages, currentPage } = usePageResolverContext();
  const { state } = useStateManagerContext();
  const { pageErrors } = usePageContext();

  const initialPageNumber = useRef(currentPage?.number);

  const computeStepStatus = ({
    uiElement,
    page,
    pageError,
    currentPage,
  }: {
    uiElement: UIElementState;
    page: UIPage;
    pageError: Record<string, ErrorField>;
    currentPage: UIPage;
  }) => {
    if (!!Object.keys(pageError).length && currentPage.number === page.number) return 'warning';
    if (
      uiElement?.isCompleted ||
      page.number <=
        // @ts-ignore
        initialPageNumber?.current
    )
      return 'completed';

    return 'idle';
  };

  const steps: BreadcrumbItemInput[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = computeStepStatus({
        // @ts-ignore
        uiElement: uiState.elements[page.stateName],
        page,
        // @ts-ignore
        pageError: pageErrors?.[page.stateName],
        // @ts-ignore
        currentPage,
      });

      const step: BreadcrumbItemInput = {
        id: page.stateName,
        label: page.name,
        state: stepStatus,
      };

      return step;
    });
  }, [pages, uiState.elements, pageErrors, currentPage]);

  const activeStep = useMemo(() => {
    const activeStep = steps.find(step => step.id === currentPage?.stateName);
    if (!activeStep) return null;

    return activeStep;
  }, [steps, currentPage]);

  return (
    <Stepper>
      <Breadcrumbs items={steps} active={activeStep}>
        {(items, theme) => {
          return (
            <VerticalLayout>
              {items.map(itemProps => {
                return (
                  <div
                    className={clsx('last:bg- flex flex-row items-center gap-4 first:bg-white')}
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
  );
};

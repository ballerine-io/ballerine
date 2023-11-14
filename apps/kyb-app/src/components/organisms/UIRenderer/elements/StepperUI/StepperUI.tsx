import { Step } from '@/common/hooks/useStepper';
import { Stepper } from '@/components/atoms/Stepper';
import { Item } from '@/components/atoms/Stepper/Item';
import { VerticalLayout } from '@/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useMemo, useRef } from 'react';
import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { UIPage } from '@/domains/collection-flow';
import { UIElementState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';

export const StepperUI = () => {
  const { state: uiState } = useDynamicUIContext();
  const { pages, currentPage } = usePageResolverContext();
  const { state } = useStateManagerContext();
  const { pageErrors } = usePageContext();

  const initialPageNumber = useRef(currentPage.number);

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
    if (uiElement?.isCompleted || page.number <= initialPageNumber.current) return 'completed';

    return 'idle';
  };

  const steps: Step[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = computeStepStatus({
        uiElement: uiState.elements[page.stateName],
        page,
        pageError: pageErrors?.[page.stateName],
        currentPage,
      });

      const step: Step = {
        index: page.number - 1,
        label: page.name,
        dataAlias: page.stateName,
        status: stepStatus,
        meta: { status: stepStatus },
        isCurrent: currentPage.number === page.number,
      };

      return step;
    });
  }, [pages, uiState.elements, pageErrors, currentPage]);

  return (
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
  );
};

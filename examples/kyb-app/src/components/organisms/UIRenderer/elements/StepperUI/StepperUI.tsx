import { Step } from '@app/common/hooks/useStepper';
import { Stepper } from '@app/components/atoms/Stepper';
import { Item } from '@app/components/atoms/Stepper/Item';
import { VerticalLayout } from '@app/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useMemo } from 'react';

export const StepperUI = () => {
  const { state: uiState } = useDynamicUIContext();
  const { pages, currentPage } = usePageResolverContext();
  const { state } = useStateManagerContext();

  console.log('ui state', uiState);

  const steps: Step[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = uiState.elements[page.stateName]?.isCompleted ? 'completed' : 'idle';

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
  }, [pages, currentPage, uiState]);

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

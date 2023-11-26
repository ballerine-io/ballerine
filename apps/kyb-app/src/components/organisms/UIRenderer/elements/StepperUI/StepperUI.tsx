import { Step } from '@/common/hooks/useStepper';
import { Stepper } from '@/components/atoms/Stepper';
import { Item } from '@/components/atoms/Stepper/Item';
import { VerticalLayout } from '@/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useMemo, useState } from 'react';
import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { UIPage } from '@/domains/collection-flow';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { isPageCompleted } from '@/helpers/prepareInitialUIState';
import { UIElementState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';

export const StepperUI = () => {
  const { state: uiState } = useDynamicUIContext();
  const { pages, currentPage } = usePageResolverContext();
  const { state, payload } = useStateManagerContext();
  const { pageErrors } = usePageContext();

  const computeStepStatus = ({
    pageError,
    page,
    context,
    uiElementState,
  }: {
    page: UIPage;
    uiElementState: UIElementState;
    pageError: Record<string, ErrorField>;
    currentPage: UIPage;
    context: CollectionFlowContext;
  }) => {
    if (
      Object.keys(pageError).length &&
      Object.values(pageError).some(error => error.type === 'warning')
    )
      return 'warning';

    if (isPageCompleted(page, context) || uiElementState?.isCompleted) return 'completed';

    return 'idle';
  };

  const [initialContext] = useState(() => structuredClone(payload));

  const steps: Step[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = computeStepStatus({
        // @ts-ignore
        uiElementState: uiState.elements[page.stateName],
        // @ts-ignore
        pageError: pageErrors?.[page.stateName],
        page,
        context: initialContext,
      });

      const step: Step = {
        index: page.number - 1,
        label: page.name,
        dataAlias: page.stateName,
        status: stepStatus,
        meta: { status: stepStatus },
        // @ts-ignore
        isCurrent: currentPage?.number === page.number,
      };

      return step;
    });
  }, [pages, uiState, pageErrors, currentPage, initialContext]);

  return (
    <Stepper>
      <VerticalLayout>
        {steps.map(step => {
          return step.hidden ? null : (
            <Item
              key={`step-${step.index}`}
              active={state === step.dataAlias}
              label={step.label}
              // @ts-ignore
              status={step.meta?.status}
            />
          );
        })}
      </VerticalLayout>
    </Stepper>
  );
};

import { Stepper } from '@/components/atoms/Stepper';
import { VerticalLayout } from '@/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useEffect, useMemo, useState } from 'react';
import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { UIPage } from '@/domains/collection-flow';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { isPageCompleted } from '@/helpers/prepareInitialUIState';
import { UIElementState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import {
  BreadcrumbItemInput,
  Breadcrumbs,
} from '@/components/atoms/Stepper/components/atoms/Breadcrumbs';
import { ScrollArea, ScrollBar, ctw } from '@ballerine/ui';

export const StepperUI = () => {
  const { state: uiState } = useDynamicUIContext();
  const { pages, currentPage } = usePageResolverContext();
  const { payload } = useStateManagerContext();
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
    if (Object.values(pageError || {}).some(error => error.type === 'warning')) return 'warning';

    if (isPageCompleted(page, context) || uiElementState?.isCompleted) return 'completed';

    return 'idle';
  };

  const [initialContext] = useState(() => structuredClone(payload));

  const steps: BreadcrumbItemInput[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = computeStepStatus({
        // @ts-ignore
        uiElementState: uiState.elements[page.stateName],
        // @ts-ignore
        pageError: pageErrors?.[page.stateName],
        page,
        context: initialContext,
        currentPage: currentPage as UIPage,
      });

      const step: BreadcrumbItemInput = {
        id: page.stateName,
        label: page.name,
        state: stepStatus,
      };

      return step;
    });
  }, [pages, uiState, pageErrors, initialContext, currentPage]);

  const activeStep = useMemo(() => {
    const activeStep = steps.find(step => step.id === currentPage?.stateName);
    if (!activeStep) return null;

    return activeStep;
  }, [steps, currentPage]);

  useEffect(() => {
    if (!activeStep) return;

    const activeBreadcrumb = document.querySelector(`[data-breadcrumb-id=${activeStep.id}]`);

    // Making sure that breadcrumb in viewport on transitions
    activeBreadcrumb?.scrollIntoView(true);
  }, [activeStep]);

  return (
    <ScrollArea orientation="vertical" className="h-full">
      <Stepper>
        <Breadcrumbs items={steps} active={activeStep}>
          {(items, theme) => {
            return (
              <VerticalLayout>
                {items.map(itemProps => {
                  return (
                    <div
                      data-breadcrumb-id={itemProps.active ? itemProps.id : undefined}
                      className={ctw('last:bg- flex flex-row items-center gap-4 first:bg-white')}
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
      <ScrollBar />
    </ScrollArea>
  );
};

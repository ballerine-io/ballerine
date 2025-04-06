import { Stepper } from '@/components/atoms/Stepper';
import {
  BreadcrumbItemInput,
  Breadcrumbs,
} from '@/components/atoms/Stepper/components/atoms/Breadcrumbs';
import { VerticalLayout } from '@/components/atoms/Stepper/layouts/Vertical';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { getCollectionFlowState } from '@ballerine/common';
import { ScrollArea, ScrollBar } from '@ballerine/ui';
import { FunctionComponent, useEffect, useMemo } from 'react';
import { computeStepStatus } from './helpers';

export const StepperUI: FunctionComponent = () => {
  const { pages, currentPage } = usePageResolverContext();
  const { payload } = useStateManagerContext();
  const collectionFlowSteps = useMemo(
    () => getCollectionFlowState(payload)?.steps || [],
    [payload],
  );

  const steps: BreadcrumbItemInput[] = useMemo(() => {
    return pages.map(page => {
      const stepStatus = computeStepStatus({
        steps: collectionFlowSteps,
        page,
      });

      const step: BreadcrumbItemInput = {
        id: page.stateName,
        label: page.name,
        state: stepStatus,
      };

      return step;
    });
  }, [pages, collectionFlowSteps]);

  const activeStep = useMemo(() => {
    const activeStep = steps.find(step => step.id === currentPage?.stateName);

    if (!activeStep) {
      return null;
    }

    return activeStep;
  }, [steps, currentPage]);

  useEffect(() => {
    if (!activeStep) {
      return;
    }

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
                      className={'flex flex-row items-center gap-4'}
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

import { stateContext } from './state.context';
import { useCallback, useEffect, useMemo } from 'react';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { View, ViewStateContext } from '@app/common/providers/ViewStateProvider/types';
import { ViewResolver } from '@app/common/providers/ViewStateProvider/components/ViewResolver';
import { useStepper } from '@app/common/hooks/useStepper';
import { convertViewsToSteps } from '@app/common/providers/ViewStateProvider/helpers/convertViewsToSteps';
import { getInitialStepIndexFromContext } from '@app/common/providers/ViewStateProvider/helpers/getInitialStepIndexFromContext';
import { convertViewsToPaths } from '@app/common/providers/ViewStateProvider/utils/convertViewsToPaths';
import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { useViewsDataRepository } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository';

const { Provider } = stateContext;
interface Props<TContext> {
  views: View[];
  viewWrapper: React.ComponentType<{ children: AnyChildren }>;
  initialContext?: TContext;
  afterUpdate?: (viewsData: AnyObject) => void;
  onViewChange?: (viewKey: string) => void;
}

export function SequencedViews<TContext extends ViewsData>({
  views,
  initialContext,
  viewWrapper,
  onViewChange,
  afterUpdate,
}: Props<TContext>) {
  const ViewWrapperComponent = viewWrapper;
  const paths = useMemo(() => convertViewsToPaths(views), [views]);

  const initialSteps = useMemo(() => convertViewsToSteps(views), [views]);
  const initialStep = useMemo(
    () => getInitialStepIndexFromContext(initialSteps, initialContext || {}),
    [initialSteps, initialContext],
  );

  const { steps, currentStep, nextStep, prevStep, completeCurrent } = useStepper(initialSteps, {
    initialStepIndex: initialStep,
  });
  const { data: viewsData, update: _update } = useViewsDataRepository(initialContext);
  console.log('data', viewsData);

  useEffect(() => {
    if (viewsData.currentView !== currentStep.dataAlias) {
      console.log('effect', currentStep.dataAlias);
      onViewChange && onViewChange(currentStep.dataAlias);
    }
  }, [currentStep.dataAlias, viewsData.currentView, onViewChange]);

  const update = useCallback(
    async (payload: object, shared?: object): Promise<object> => {
      const updatedData = await _update(currentStep.dataAlias, payload, shared);
      afterUpdate && afterUpdate(updatedData);
      return updatedData;
    },
    [currentStep, _update, afterUpdate],
  );

  const saveAndPerformTransition = useCallback(
    async (payload: object, shared?: object) => {
      await update(payload, shared);
      completeCurrent();
      nextStep();
    },
    [update, nextStep, completeCurrent],
  );

  const context = useMemo(() => {
    const ctx: ViewStateContext<AnyObject> = {
      context: viewsData,
      state: currentStep.dataAlias,
      steps: steps,
      update,
      saveAndPerformTransition,
      next: nextStep,
      prev: prevStep,
    };

    return ctx;
  }, [viewsData, currentStep, steps, update, nextStep, prevStep, saveAndPerformTransition]);

  return (
    <Provider value={context}>
      <ViewWrapperComponent>
        <ViewResolver paths={paths} />
      </ViewWrapperComponent>
    </Provider>
  );
}

SequencedViews.ViewResolver = ViewResolver;

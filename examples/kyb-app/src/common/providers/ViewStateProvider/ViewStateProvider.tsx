import { stateContext } from './state.context';
import { useCallback, useMemo } from 'react';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { View, ViewStateContext } from '@app/common/providers/ViewStateProvider/types';
import { ViewResolver } from '@app/common/providers/ViewStateProvider/components/ViewResolver';
import debounce from 'lodash/debounce';
import { useStepper } from '@app/common/hooks/useStepper';
import { convertViewsToSteps } from '@app/common/providers/ViewStateProvider/helpers/convertViewsToSteps';
import { useDataContext } from '@app/common/providers/ViewStateProvider/hooks/useDataContext';

const { Provider } = stateContext;
interface Props {
  views: View[];
  initialViewsData?: AnyObject;
  children: AnyChildren;
}

export const ViewStateProvider = ({ children, views, initialViewsData }: Props) => {
  const initialSteps = useMemo(() => convertViewsToSteps(views), [views]);

  const { steps, currentStep, nextStep, prevStep, completeCurrent } = useStepper(initialSteps, {});
  const { data: contextData, update: _update } = useDataContext();

  const next = useCallback(() => {
    completeCurrent();
    nextStep();
  }, [nextStep, completeCurrent]);

  const prev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const update = useCallback(
    (payload: object, shared?: object) => {
      _update(currentStep.dataAlias, payload, shared);
    },
    [currentStep, _update],
  );

  const updateAsync = useMemo(() => debounce(update, 1000), [update]);

  const saveAndPerformTransition = useCallback(
    (payload: object, shared?: object) => {
      update(payload, shared);
      completeCurrent();
      next();
    },
    [update, next, completeCurrent],
  );

  const context = useMemo(() => {
    const ctx: ViewStateContext<AnyObject> = {
      context: contextData,
      updateAsync,
      state: currentStep.dataAlias,
      steps: steps,
      update,
      saveAndPerformTransition,
      next,
      prev,
    };

    return ctx;
  }, [contextData, currentStep, updateAsync, steps, update, next, prev, saveAndPerformTransition]);

  return <Provider value={context}>{children}</Provider>;
};

ViewStateProvider.ViewResolver = ViewResolver;

import { View, useViewState } from '@app/common/providers/ViewStateProvider';
import { useCallback } from 'react';

export const useNextviewMoveResolved = <TContext>(activeView: View<TContext>) => {
  const { steps, saveAndPerformTransition, finish, save } = useViewState();

  const next = useCallback(
    <TValues>(values: TValues) => {
      const isFinal = activeView?.isFinal
        ? activeView.isFinal
        : steps.length
        ? steps.at(-1).dataAlias === activeView?.key
        : false;

      if (isFinal) {
        void save(values).then(finalContext => {
          finish(finalContext);
        });
        return;
      }

      saveAndPerformTransition(values);
    },
    [activeView, steps, save, finish, saveAndPerformTransition],
  );

  return {
    next,
  };
};

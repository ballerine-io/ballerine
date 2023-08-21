import { View, useViewState } from '@app/common/providers/ViewStateProvider';
import { useCallback } from 'react';

export const useNextviewMoveResolved = <TContext>(activeView: View<TContext>) => {
  const { saveAndPerformTransition, finish, save } = useViewState();

  const next = useCallback(
    <TValues>(values: TValues) => {
      if (activeView.isFinal) {
        void save(values).then(finalContext => {
          finish(finalContext);
        });
        return;
      }

      saveAndPerformTransition(values);
    },
    [activeView, save, finish, saveAndPerformTransition],
  );

  return {
    next,
  };
};

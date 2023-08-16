import { stateContext } from '@app/common/providers/ViewStateProvider/state.context';
import { ViewStateContext } from '@app/common/providers/ViewStateProvider/types';
import { useContext } from 'react';

export function useViewState<TContext, TViewMeta = {}>() {
  return useContext(stateContext) as ViewStateContext<TContext, TViewMeta>;
}
